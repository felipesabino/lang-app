import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Story } from "./model/story-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

export const handler = async (event: Record<string, AttributeValue>): Promise<{status: string, input: any, unmarshalled: Story}> => {
  const unmarshalled = unmarshall(event) as Story;
  return { status: 'OK', input: event, unmarshalled };
}