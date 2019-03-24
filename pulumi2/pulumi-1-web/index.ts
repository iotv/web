import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

const config = new pulumi.Config('pulumi-1-web')
const domainStack = new pulumi.StackReference(config.require('domainStack'))

const bucket = new aws.s3.Bucket('Site', {
  serverSideEncryptionConfiguration: {
    rule: {
      applyServerSideEncryptionByDefault: {
        sseAlgorithm: 'AES256',
      },
    },
  },
  tags: {
    Application: 'iotv',
    Pulumi: 'true',
    Repository: 'https://github.com/iotv/iotv',
    Stack: 'pulumi-1-web',
  },
})

const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity('Site')

const bucketPolicy = pulumi.all([bucket.id, originAccessIdentity.iamArn]).apply(
  ([bucket, iamArn]) =>
    new aws.s3.BucketPolicy(bucket, {
      bucket,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucket}/*`],
            Principal: {
              AWS: iamArn,
            },
          },
        ],
      },
    }),
)

const cloudfrontDistribution = pulumi
  .all([
    originAccessIdentity.cloudfrontAccessIdentityPath,
    bucket.bucketRegionalDomainName,
  ])
  .apply(
    ([originAccessIdentity, domainName]) =>
      new aws.cloudfront.Distribution('Site', {
        aliases: [domainStack.getOutput('domainName')],
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
        tags: {
          Application: 'iotv',
          Pulumi: 'true',
          Repository: 'https://github.com/iotv/iotv',
          Stack: 'pulumi-1-web',
        },
        viewerCertificate: {
          acmCertificateArn: domainStack.getOutput('certificateArn'),
          sslSupportMethod: 'sni-only',
        },
      }),
  )

export const bucketName = bucket.id
export const distributionDomainName = cloudfrontDistribution.apply(
  distribution => distribution.domainName,
)
export const distributionHostedZoneId = cloudfrontDistribution.apply(
  distribution => distribution.hostedZoneId,
)
