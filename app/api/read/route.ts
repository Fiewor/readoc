const { Storage } = require("@google-cloud/storage");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const projectId = process.env.PROJECT_ID;
const keyFilename = process.env.KEYFILENAME; // The json file for the cloud keys
const bucketName = process.env.BUCKET_NAME;

const storage = new Storage({ projectId, keyFilename });

// Upload a file to Google Cloud Storage
const googleCloudUploader = async (file: string, fileOutputName: string) => {
  try {
    // Get a reference to the specified bucket
    const bucket = storage.bucket(bucketName);

    // Upload the specified file to the bucket with the given destination name
    const [fileUpload] = await bucket.upload(file, {
      destination: fileOutputName,
    });

    console.log("fileUpload: ", googleCloudUploader);

    // Get the authenticated URL for the uploaded file
    const [url] = await fileUpload.getSignedUrl({
      action: "read",
      expires: Date.now() + 2 * 30 * 24 * 60 * 60 * 1000, // URL expires in 2 months
    });

    return url;
  } catch (error) {
    console.error("Error(upload):", error);
  }
};

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ body });
  //! upload to google cloud
  // googleCloudUploader(path, originalname)

  //! get url
  // const imageUrl = `gs://${bucketName}/${originalname}`;

  // const filePart = {
  //   file_data: {
  //     file_uri: imageUrl,
  //     mime_type: "application/pdf",
  //   },
  // };

  //! use url to generate FilePart and read content with AI
  // const result = await model.generateContent([prompt, filePart]);
  // const response = await result.response;
  // const text = response.text();
  // console.log("text: ", text)
  // return new Response(JSON.stringify({text}))
  // return Response.json({ text });
}
