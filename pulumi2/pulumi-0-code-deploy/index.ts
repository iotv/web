import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

const bucket = new aws.s3.Bucket('CodeDeploy', {
  serverSideEncryptionConfiguration: {
    rule: {
      applyServerSideEncryptionByDefault: {
        sseAlgorithm: 'AES256',
      },
    },
  },
})

export const bucketName = bucket.id
