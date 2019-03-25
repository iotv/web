import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

const config = new pulumi.Config('pulumi-2-dns')
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
