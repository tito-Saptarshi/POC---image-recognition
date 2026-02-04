export async function sendImageToApiOld({ image, title }) {
  const formData = new FormData();

  formData.append("image", image);     // file
  if (title) {
    formData.append("title", title);   // optional text
  }

  const response = await fetch("https://www.imagereview.com/abc", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json(); // backend response
}

const BASE_URL = "https://api.runway.xyz"; // change this

export async function sendImageToApi({ image, title }) {
  const formData = new FormData();
  formData.append("image", image);

  if (title) {
    formData.append("title", title);
  }
  console.log(formData);
   console.log(formData.get("title"));
   console.log(formData.get("image")); // should show the file object

  const response = await fetch(`${BASE_URL}/process-image`, {
    method: "POST",
    body: formData,
  });
  

  if (!response.ok) {
    throw new Error("Image API failed");
  }

  const data = await response.json();

 
  return {
    message: "Image classified successfully",
    result: {
      label: data.class,
      confidence: (data.confidence * 100).toFixed(2) + "%",
      price: "-", // not provided by this API
    },
    matches: data.matches || [], // keep extra data if needed later
  };
}

export async function sendZipToApi(zipFile) {
  const formData = new FormData();
  formData.append("file", zipFile);

  const response = await fetch(`${BASE_URL}/process-zip`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("ZIP API failed");
  }

  const data = await response.json();

  return {
    message: data.message ?? "ZIP processed",
    result: {
      label: "Batch Upload",
      confidence: "-",
      price: "-",
    },
  };
}