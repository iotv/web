import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

const config = new pulumi.Config('pulumi-0-domain')

const zone = new aws.route53.Zone('iotv:Domain', {
  name: config.require('domainName'),
  tags: {
    Application: 'iotv',
    Pulumi: 'true',
    Repository: 'https://github.com/iotv/iotv',
    Stack: 'pulumi-0-domain',
  },
})

const certificate = new aws.acm.Certificate('iotv:Certificate', {
  domainName: config.require('domainName'),
  subjectAlternativeNames: [
    config.require('domainName'),
    `*.${config.require('domainName')}`,
  ],
  tags: {
    Application: 'iotv',
    Pulumi: 'true',
    Repository: 'https://github.com/iotv/iotv',
    Stack: 'pulumi-0-domain',
  },
  validationMethod: 'DNS',
})

console.log(`Ensure that your domain is configured to use AWS DNS.
The values are in the NS block of the itov:Domain resource.')
If these values aren't set, the creation of validations will hang.`)

const bareValidationRecord = pulumi
  .all([zone.id, certificate.domainValidationOptions[0]])
  .apply(
    ([zoneId, domainValidationOptions]) =>
      new aws.route53.Record('iotv:BareValidationRecord', {
        name: domainValidationOptions.resourceRecordName,
        records: [domainValidationOptions.resourceRecordValue],
        ttl: 60,
        type: domainValidationOptions.resourceRecordType,
        zoneId,
      }),
  )

const bareValidation = bareValidationRecord.apply(record =>
  pulumi.all([record.fqdn, certificate.arn]).apply(
    ([fqdn, certificateArn]) =>
      new aws.acm.CertificateValidation('iotv:BareValidation', {
        certificateArn,
        validationRecordFqdns: [fqdn],
      }),
  ),
)

const splatValidationRecord = pulumi
  .all([zone.id, certificate.domainValidationOptions[1]])
  .apply(
    ([zoneId, domainValidationOptions]) =>
      new aws.route53.Record('iotv:SplatValidationRecord', {
        name: domainValidationOptions.resourceRecordName,
        records: [domainValidationOptions.resourceRecordValue],
        ttl: 60,
        type: domainValidationOptions.resourceRecordType,
        zoneId,
      }),
  )

const splatValidation = splatValidationRecord.apply(record =>
  pulumi.all([record.fqdn, certificate.arn]).apply(
    ([fqdn, certificateArn]) =>
      new aws.acm.CertificateValidation('iotv:SplatValidation', {
        certificateArn,
        validationRecordFqdns: [fqdn],
      }),
  ),
)

export const domainName = config.require('domainName')
export const domainZoneId = zone.id
export const certificateArn = certificate.arn
