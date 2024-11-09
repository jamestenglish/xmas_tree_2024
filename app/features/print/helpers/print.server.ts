// @ts-ignore
// import ipp from "@sealsystems/ipp";
import { MOCK_PRINT } from "~/constants";
import getJobAttributesMock from "./getJobAttributesMock.server";

type StatusCodeType = "successful-ok" | "server-error-busy";

type JobStateType = "processing" | "processing-stopped" | "completed";
type JobStateReasonsType = "job-printing";

type ResponseOperationAttributesType = {
  "attributes-charset": string;
  "attributes-natural-language": string;
  "status-message"?: string;
};

type PrintResponseJobAttributesTagType = {
  "job-uri": string;
  "job-id": number;
  "job-state": JobStateType;
  "job-state-reasons": JobStateReasonsType;
};

export type PrintResponseType = {
  version: string;
  statusCode: StatusCodeType;
  id: number;
  "operation-attributes-tag": ResponseOperationAttributesType;
  "job-attributes-tag"?: PrintResponseJobAttributesTagType;
};

export default async function print({
  url,
  data,
}: {
  url: string;
  data: Buffer;
}) {
  const printResponse = await new Promise<PrintResponseType | null>(
    (resolve, reject) => {
      console.log({ url });
      const printer = new ipp.Printer(url);
      const msg = {
        "operation-attributes-tag": {
          "document-format": "image/jpeg",
        },

        data: Buffer.from(data),
      };

      printer.execute(
        "Print-Job",
        msg,
        function (
          err: Error | null,
          res: {
            version: string;
            operation: any;
            statusCode: any;
            id: any;
            data: any;
          } | null,
        ) {
          if (err !== null) {
            console.error(res);
            console.error(err);
            reject(err);
          } else {
            resolve(res as PrintResponseType | null);
          }
        },
      );
    },
  );

  if (printResponse?.statusCode === "server-error-busy") {
    console.error({ printResponse });
    console.error("print throwing error");
    throw new Error(`print: ${printResponse?.statusCode}`);
  }

  return printResponse;
}

export async function queryPrinterAttributes({ url }: { url: string }) {
  const attributeResponse = await new Promise((resolve, reject) => {
    // const dataA = ipp.serialize({
    //   operation: "Get-Printer-Attributes",
    //   "operation-attributes-tag": {
    //     "attributes-charset": "utf-8",
    //     "attributes-natural-language": "en",
    //     "printer-uri": url,
    //   },
    // });

    // ipp.request(url, dataA, function (err: any, res: any) {
    //   if (err) {
    //     console.error(err);
    //     reject(err);
    //   } else {
    //     resolve(res);
    //   }
    // });
  });

  return attributeResponse;
}

type GetJobAttributesJobAttributesTagType = {
  "job-id": number;
  "job-uri": string;
  "job-uuid": string;
  "job-printer-uri": string;
  "job-state": JobStateType;
  "job-state-reasons": JobStateReasonsType;
  "job-printer-up-time": number;
  "job-originating-user-name": string;
  "job-name": string;
  "time-at-creation": number | "";
  "time-at-processing": number | "";
  "time-at-completed": number | "";
  "job-impressions": number | "";
  "job-impressions-completed": number;
};

export type GetJobAttributesType = {
  version: string;
  statusCode: StatusCodeType;
  id: number;
  "operation-attributes-tag": ResponseOperationAttributesType;
  "job-attributes-tag": GetJobAttributesJobAttributesTagType;
};

export async function getJobAttributes({
  url,
  jobId,
}: {
  url: string;
  jobId: number | undefined;
}) {
  if (MOCK_PRINT) {
    return getJobAttributesMock({ url, jobId });
  }
  console.log("getJobAttributes", { jobId });
  if (jobId !== undefined) {
    const attributeResponse = await new Promise<GetJobAttributesType | null>(
      (resolve, reject) => {
        // const dataA = ipp.serialize({
        //   operation: "Get-Job-Attributes",
        //   "operation-attributes-tag": {
        //     "attributes-charset": "utf-8",
        //     "attributes-natural-language": "en",
        //     "printer-uri": url,
        //     "job-id": jobId,
        //   },
        // });

        // ipp.request(url, dataA, function (err: any, res: any) {
        //   if (err) {
        //     console.error(err);
        //     reject(err);
        //   } else {
        //     resolve(res);
        //   }
        // });
      },
    );

    if (
      attributeResponse?.["job-attributes-tag"]?.["job-state"] ===
      "processing-stopped"
    ) {
      console.error({ attributeResponse });
      console.error("getJobAttributes throwing");
      throw new Error(
        `getJobAttributes: ${attributeResponse?.["job-attributes-tag"]?.["job-state"]}`,
      );
    }
    return attributeResponse;
  }

  throw Error("jobId is undefined");
}

export async function getJobs({ url }: { url: string }) {
  const attributeResponse = await new Promise((resolve, reject) => {
    // const dataA = ipp.serialize({
    //   operation: "Get-Jobs",
    //   "operation-attributes-tag": {
    //     "attributes-charset": "utf-8",
    //     "attributes-natural-language": "en",
    //     "printer-uri": url,
    //   },
    // });

    // ipp.request(url, dataA, function (err: any, res: any) {
    //   if (err) {
    //     console.error(err);
    //     reject(err);
    //   } else {
    //     resolve(res);
    //   }
    // });
  });

  return attributeResponse;
}

/*
{
  "version": "2.0",
  "statusCode": "successful-ok",
  "id": 68965998,
  "operation-attributes-tag": {
    "attributes-charset": "utf-8",
    "attributes-natural-language": "en-us"
  },
   'job-attributes-tag': {
      'job-uri': 'ipp:///jobs/1',
      'job-id': 1,
      'job-state': 'processing',
      'job-state-reasons': 'job-printing'
    }
}

BAD PRINT RESPONSE:
print response: 
{
  response: {
    version: '2.0',
    statusCode: 'server-error-busy',
    id: 38612995,
    'operation-attributes-tag': {
      'attributes-charset': 'utf-8',
      'attributes-natural-language': 'en-us',
      'status-message': 'Server error busy'
    }
  }
}

GOOD PRINT RESPONSE
print response: 
{
  response: {
    version: '2.0',
    statusCode: 'successful-ok',
    id: 83706903,
    'operation-attributes-tag': {
      'attributes-charset': 'utf-8',
      'attributes-natural-language': 'en-us'
    },
    'job-attributes-tag': {
      'job-uri': 'ipp:///jobs/2',
      'job-id': 2,
      'job-state': 'processing',
      'job-state-reasons': 'job-printing'
    }
  }
}

getJobsResult: 
{
  getJobsResult: {
    version: '2.0',
    statusCode: 'successful-ok',
    id: 85146345,
    'operation-attributes-tag': {
      'attributes-charset': 'utf-8',
      'attributes-natural-language': 'en-us'
    },
    'job-attributes-tag': { 'job-id': 1, 'job-uri': 'ipp:///jobs/1' }
  }
}

jobAttributes: 
{
  jobAttributes: {
    version: '2.0',
    statusCode: 'successful-ok',
    id: 61110276,
    'operation-attributes-tag': {
      'attributes-charset': 'utf-8',
      'attributes-natural-language': 'en-us'
    },
    'job-attributes-tag': {
      'job-id': 1,
      'job-uri': 'ipp:///jobs/1',
      'job-uuid': 'urn:uuid:f875d5e4-b776-4168-91a1-dcc2c9d1aa9b',
      'job-printer-uri': 'http://10.0.0.145:631/',
      'job-state': 'processing-stopped', // TODO JTE <---
      'job-state-reasons': 'job-printing', // TODO JTE <---
      'job-printer-up-time': 2944,
      'job-originating-user-name': '',
      'job-name': 'foo',
      'time-at-creation': 2198,
      'time-at-processing': 2198,
      'time-at-completed': '', // TODO JTE <----
      'job-impressions': '',
      'job-impressions-completed': 0
    }
  }
}

jobAttributes: 
{
  jobAttributes: {
    version: '2.0',
    statusCode: 'successful-ok',
    id: 94227514,
    'operation-attributes-tag': {
      'attributes-charset': 'utf-8',
      'attributes-natural-language': 'en-us'
    },
    'job-attributes-tag': {
      'job-id': 3,
      'job-uri': 'ipp:///jobs/3',
      'job-uuid': 'urn:uuid:f875d5e4-b776-4168-91a1-dcc2c9d1aa9b',
      'job-printer-uri': 'http://10.0.0.145:631/',
      'job-state': 'processing',
      'job-state-reasons': 'job-printing',
      'job-printer-up-time': 3262,
      'job-originating-user-name': '',
      'job-name': '',
      'time-at-creation': 3259,
      'time-at-processing': 3259,
      'time-at-completed': '',
      'job-impressions': '',
      'job-impressions-completed': 0
    }
  }
}
*/
