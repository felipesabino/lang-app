# Story Generation Workflow

[Check diagram online](http://www.plantuml.com/plantuml/png/fLHFS_ic4BtpAROw_pmv-EP39d_Ifkd46K_bJCzOR6mQ12gidFhR5rOOcpZfvNSIOX-FjsztkGaaFOsz4R_G3dk4mKXjXUp8UNWDw4466EDNRDnebVG7k5qzfKqvQ86MD1sW-SDje2KNW_SU9MbdcmJvsst44EbrfmTf2UvtaXvNwnJQ3bI5cjk_MbWvOmvySaYhIy3QInkC96GG7VykWUqSPbdHtTYz8_61CFy2-T96ADyCzwuV318gMBj1TzCP6pWeb2IvaG6XUJXOsRk7EuuhjH5298TWTfrCWGMqoTFQ4BPKxoKX6sTTNBWzUlRs1-_DU0rQnHNN8du37KpwRhtiU-dZwiDv5Qu2MaBROOWxSbJQJSYhlTCT2hGAqWqYqaPLIMCK9VSOigWbaapvY1Z9iXVm9zBeRKOygLJRDuq-awHYvipIikG5iVObDwvuYiuoQJxCcIqkgHLMheYjT-C0pOHxH8j-QgQ9ypfrpUAuZnETY7j7UJc5Wb3vnZN-Io9pdBfcSMgdSro9VsOjQ5KJXZcRUqu2qggCvmGID1UYmhuEYldwOps4SIuQyE9yBmsqmu3g1xJ6VHGBMD5lETukd_C-3qoI-i-8WU2MUw8uU2aW8zOolCU223vU9RDSpSjk6O85l3WkNSYpKhWl5BG3OhU3fVJluMU4L4J_guWfpcGfhDgIfoBPomlkjBhXKdFJ6E1P1qfwi-NJPRdr0nYEQhi5SlnuK7egwWauYYlrgZLsMMFjHcw6enCGM8sG9ZrKnl1-iHsRhuvo6laWo03DzZW8pMStqAep7ueHlw_NArWvPrA2Ryv3OCgJukRygKkpI71ktic713j_VuHINpyBF5zUunvh9iwyhem-vQ--4rBUjkykh-xEy_QhZ1qcGq0wqORvnEfe5pUOCSnF1qitAQnphfszYSknD_y1)

![diagram](./images/StoryGenerationWorkflow.png)

```plantuml
@startuml
!theme plain
actor User as user
boundary API as api
entity "Job Story Creation" as job
participant ChatGPT as gpt
participant "AWS Polly" as polly
participant "AWS Translate" as translate
participant "AWS S3 - Story Bucket" as s3
participant "AWS SNS - Polly Completed Topic" as snsPolly
database "DynamoDB" as ddb


user -> api : Start Story Creation
activate api
note over user, api
- user id
- theme
- style
- grammar
- words/sentences
- audio style/voice
end note
api -> ddb: Saves Story Metadata
ddb -> api: Return Story Identifier
api -> job: Start job Creation Job
activate job
job --> api:
api -> user: Story Identifier
deactivate api

group "Story Generation"
job -> gpt: Generate Story
gpt -> job: Return Generated Story Text

job -> translate: Translate Story Text
translate -> job: Return Translated Text

job -> s3: Save Story Text and Translation
job -> ddb: Save Story Updated metadata

loop "Normal Spped, Slow"
job -> job: Formal SSML
job ->polly: Request Audio Generation
job -> ddb: Save Audio Task Id
polly -> s3: Save MP3
polly -> snsPolly: Notifies Completion
job ->polly: Request Speech Marks Generation
job -> ddb: Save Audio Task Id
polly -> s3: Save Speech Marks
polly -> snsPolly: Notifies Task Completion
deactivate job

end loop
end group

group "Story Status Listener"
job --> sns: Starts listening to SNS topic
activate job
snsPolly -> job: Notifies Task completion
job -> ddb: Update Task Id status
alt "All Tasks Complete"
job -> ddb: Update Story status as "generated"
deactivate job
end
end group


group "HTTP Pooling for story completion"
user -> api: Get Story Status
activate user
api -> ddb:
ddb --> api:
api -> user: Retrieve Story Status

alt "Story Status is Completed"
user -> api: Get Story Metadata
api -> ddb:
ddb --> api
api -> user:
loop "Each asset"
user -> s3: Get other data
s3 -> user:
end loop
deactivate user
end
end group
@enduml
```