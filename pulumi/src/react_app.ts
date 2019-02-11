import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {entries, flatten, getOr} from 'lodash/fp'
import {getZone} from '@pulumi/aws/route53'
import * as mime from 'mime'
import * as fs from 'fs'
import * as path from 'path'


type ReactAppArgs = {
  path: string
  acmCertificateArn: string
  aliases: string[]
  aliasRoute53Map?: {[alias: string]: aws.route53.GetZoneArgs}
}

class ReactApp extends pulumi.ComponentResource {
  public readonly bucket: aws.s3.Bucket
  public readonly objects: pulumi.Output<aws.s3.BucketObject[]>
  public readonly originAccessIdentity: aws.cloudfront.OriginAccessIdentity
  public readonly distribution: pulumi.Output<aws.cloudfront.Distribution>
  public readonly records: pulumi.Output<aws.route53.Record[]>

  constructor(name: string, args: ReactAppArgs, opts?: pulumi.ResourceOptions) {
    super('iotv:ReactApp', name, args, opts)

    this.bucket = new aws.s3.Bucket(name, {}, {parent: this})
    this.originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
      name,
      {},
      {parent: this},
    )

    // this.objects = this.bucket.bucket.apply(bucket => )

    this.distribution = pulumi
      .all([
        this.originAccessIdentity.cloudfrontAccessIdentityPath,
        this.bucket.bucketRegionalDomainName,
      ])
      .apply(
        ([originAccessIdentity, domainName]) =>
          new aws.cloudfront.Distribution(
            name,
            {
              aliases: args.aliases,

              customErrorResponses: [
                {
                  errorCode: 404,
                  responseCode: 200,
                  responsePagePath: '/index.html',
                },
                {
                  errorCode: 403,
                  responseCode: 200,
                  responsePagePath: '/index.html',
                },
                {
                  errorCode: 400,
                  responseCode: 200,
                  responsePagePath: '/index.html',
                },
              ],
              defaultCacheBehavior: {
                allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
                cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
                compress: true,
                forwardedValues: {
                  queryString: false,
                  cookies: {
                    forward: 'none',
                  },
                },
                targetOriginId: 'S3',
                viewerProtocolPolicy: 'redirect-to-https',
              },
              defaultRootObject: 'index.html',
              enabled: true,
              httpVersion: 'http2',
              isIpv6Enabled: true,
              origins: [
                {
                  s3OriginConfig: {
                    originAccessIdentity,
                  },
                  domainName,
                  originId: 'S3',
                },
              ],
              restrictions: {
                geoRestriction: {
                  restrictionType: 'none',
                },
              },
              viewerCertificate: {
                acmCertificateArn: args.acmCertificateArn,
                sslSupportMethod: 'sni-only',
              },
            },
            {parent: this},
          ),
      )

    this.records = this.distribution.apply(({domainName, hostedZoneId}) =>
      flatten(
        entries(getOr({}, 'aliasRoute53Map')!).map(([alias, zoneArgs]) => [
          new aws.route53.Record(
            `${name}-${alias}`,
            {
              aliases: [
                {
                  evaluateTargetHealth: false,
                  name: domainName,
                  zoneId: hostedZoneId,
                },
              ],
              type: 'A',
              zoneId: getZone(zoneArgs).then(zone => zone.zoneId),
            },
            {parent: this},
          ),
          new aws.route53.Record(
            `${name}-${alias}`,
            {
              aliases: [
                {
                  evaluateTargetHealth: false,
                  name: domainName,
                  zoneId: hostedZoneId,
                },
              ],
              type: 'AAAA',
              zoneId: getZone(zoneArgs).then(zone => zone.zoneId),
            },
            {parent: this},
          ),
        ]),
      ),
    )

    this.registerOutputs({
      bucket: this.bucket,
      objects: this.objects,
      originAccessIdentity: this.originAccessIdentity,
      distribution: this.distribution,
      records: this.records,
    })
  }
}
