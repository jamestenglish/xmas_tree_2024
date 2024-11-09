let mockIndex = 0;

const waitingStatus = JSON.parse(`{
  "version": "2.0",
  "statusCode": "successful-ok",
  "id": 94227514,
  "operation-attributes-tag": {
    "attributes-charset": "utf-8",
    "attributes-natural-language": "en-us"
  },
  "job-attributes-tag": {
    "job-id": 3,
    "job-uri": "ipp:///jobs/3",
    "job-uuid": "urn:uuid:f875d5e4-b776-4168-91a1-dcc2c9d1aa9b",
    "job-printer-uri": "http://10.0.0.145:631/",
    "job-state": "processing",
    "job-state-reasons": "job-printing",
    "job-printer-up-time": 3262,
    "job-originating-user-name": "",
    "job-name": "",
    "time-at-creation": 3259,
    "time-at-processing": 3259,
    "time-at-completed": "",
    "job-impressions": "",
    "job-impressions-completed": 0
  }
}`);

const finishedStatus = JSON.parse(`{
  "version": "2.0",
  "statusCode": "successful-ok",
  "id": 94227514,
  "operation-attributes-tag": {
    "attributes-charset": "utf-8",
    "attributes-natural-language": "en-us"
  },
  "job-attributes-tag": {
    "job-id": 3,
    "job-uri": "ipp:///jobs/3",
    "job-uuid": "urn:uuid:f875d5e4-b776-4168-91a1-dcc2c9d1aa9b",
    "job-printer-uri": "http://10.0.0.145:631/",
    "job-state": "completed",
    "job-state-reasons": "job-printing",
    "job-printer-up-time": 3262,
    "job-originating-user-name": "",
    "job-name": "",
    "time-at-creation": 3259,
    "time-at-processing": 3259,
    "time-at-completed": 1234,
    "job-impressions": "",
    "job-impressions-completed": 0
  }
}`);

const mockStatuses = [waitingStatus, waitingStatus, finishedStatus];

export default async function getJobAttributesMock({
  url,
  jobId,
}: {
  url: string;
  jobId: number | undefined;
}) {
  const status = mockStatuses[mockIndex % mockStatuses.length];
  mockIndex += 1;
  return Promise.resolve(status);
}
