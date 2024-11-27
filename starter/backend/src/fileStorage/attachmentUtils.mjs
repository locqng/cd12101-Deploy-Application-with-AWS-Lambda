import AWS from 'aws-sdk'
import AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger.mjs'

const s3BucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = +process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('attachmentUtils')

export class AttachmentUtils {
  buildAttachmentUrl(todoId) {
    return `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
  }

  getUploadUrl(todoId) {
    logger.info('Getting signed URL...')
    const XAWS = AWSXRay.captureAWS(AWS)
    const s3 = new XAWS.S3({ signatureVersion: 'v4' })
    return s3.getSignedUrl('putObject', {
      Bucket: s3BucketName,
      Key: todoId,
      Expires: urlExpiration
    })
  }
}
