export type AutoScalingDynamoDBTableArgs = {
  hashKey: string
  globalSecondaryIndices?: string[]
}

export type DynamoDBArgs = {
  hashKey: string
  uniqueKeys?: string[]
  globalSecondaryIndices?: string[]
}

export type DynamoDBAutoscalingArgs = {
  minCapacity: number
  maxCapacity: number
  targetValue: number
  tableName: string
  globalSecondaryIndexNames?: string[]
}
