self.addEventListener('fetch', event => {

  // Handle the share_target shares
  if (event.request.method === 'POST') {

    // Make sure we're only getting shares to the share-target route
    const path = event.request.url.split("/").pop();

    if(path === "share-target"){

        //Get the audio from the share request
        event.request.formData().then(formData => {

            // Find the correct client in order to share the results.
            const clientId = event.resultingClientId !== "" ? event.resultingClientId : event.clientId;
            self.clients.get(clientId).then(client => {

                // Get the images and video
                const audio = formData.getAll('audio');
                const image = formData.getAll('image');
                // Send them to the client
                client.postMessage(
                    {
                        message: "newMedia",
                        audio: audio,
                        image: image
                    }
                );


            });
        });
    }
  }
});

importScripts('./ngsw-worker.js');
