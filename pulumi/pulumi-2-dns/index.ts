import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

const config = new pulumi.Config('pulumi-2-dns')
const apiStack = new pulumi.StackReference(config.require('apiStack'))
const domainStack = new pulumi.StackReference(config.require('domainStack'))
const webStack = new pulumi.StackReference(config.require('webStack'))

const aRecord = new aws.route53.Record('ASite', {
  aliases: [
    {
      evaluateTargetHealth: false,
      name: webStack.getOutput('distributionDomainName'),
      zoneId: webStack.getOutput('distributionHostedZoneId'),
    },
  ],
  name: domainStack.getOutput('domainName'),
  type: 'A',
  zoneId: domainStack.getOutput('domainZoneId'),
})

const aaaaRecord = new aws.route53.Record('AAAASite', {
  aliases: [
    {
      evaluateTargetHealth: false,
      name: webStack.getOutput('distributionDomainName'),
      zoneId: webStack.getOutput('distributionHostedZoneId'),
    },
  ],
  name: domainStack.getOutput('domainName'),
  type: 'AAAA',
  zoneId: domainStack.getOutput('domainZoneId'),
})

const apiCustomDomain = new aws.apigateway.DomainName('APICustomDomain', {
  certificateArn: domainStack.getOutput('certificateArn'),
  domainName: domainStack
    .getOutput('domainName')
    .apply(domainName => `api.${domainName}`),
})

const apiRecords = pulumi
  .all([apiCustomDomain.cloudfrontDomainName, apiCustomDomain.cloudfrontZoneId])
  .apply(([name, zoneId]) => [
    new aws.route53.Record('APIARecord', {
      aliases: [
        {
          evaluateTargetHealth: true,
          name,
          zoneId,
        },
      ],
      name: domainStack
        .getOutput('domainName')
        .apply(domainName => `api.${domainName}`),
      type: 'A',
      zoneId: domainStack.getOutput('domainZoneId'),
    }),
    new aws.route53.Record('APIAAAARecord', {
      aliases: [
        {
          evaluateTargetHealth: true,
          name,
          zoneId,
        },
      ],
      name: domainStack
        .getOutput('domainName')
        .apply(domainName => `api.${domainName}`),
      type: 'AAAA',
      zoneId: domainStack.getOutput('domainZoneId'),
    }),
  ])

const basePathMapping = new aws.apigateway.BasePathMapping('GraphQLMapping', {
  basePath: '',
  domainName: domainStack
    .getOutput('domainName')
    .apply(domainName => `api.${domainName}`),
  restApi: apiStack.getOutput('restApiId'),
})
