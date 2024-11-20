const { Fido2Lib } = require("fido2-lib");

// Initialize Fido2Lib
const fido2 = new Fido2Lib({
  timeout: 60000,
  rpId: "yourdomain.com", // Replace with your domain
  rpName: "TaskMaster",
  challengeSize: 32,
  cryptoParams: [-7, -257], // Algorithms: ES256, RS256
});

async function verifyAssertion(assertion, storedPublicKey, storedCredentialId) {
  if (!assertion || !storedPublicKey || !storedCredentialId) {
    throw new Error("Invalid parameters provided for assertion verification.");
  }

  const { response, id } = assertion;

  try {
    // Convert inputs to Buffer
    const publicKeyCredential = {
      rawId: Buffer.from(id, "base64"),
      response: {
        clientDataJSON: Buffer.from(response.clientDataJSON, "base64"),
        authenticatorData: Buffer.from(response.authenticatorData, "base64"),
        signature: Buffer.from(response.signature, "base64"),
      },
    };

    const assertionExpectations = {
      challenge: assertion.response.clientDataJSON.challenge,
      origin: "https://yourdomain.com", // Replace with your domain
      factor: "either",
    };

    // Verify assertion using fido2-lib
    const result = await fido2.assertionResult(publicKeyCredential, assertionExpectations);

    return result; // If valid, it returns the verification result
  } catch (error) {
    console.error("Error during WebAuthn assertion verification:", error);
    return false;
  }
}

module.exports = { verifyAssertion };


// const webauthn = require('webauthn');



// function verifyAssertion(assertion, storedPublicKey, storedCredentialId) {
//   if (!assertion || !storedPublicKey || !storedCredentialId) {
//     throw new Error("Invalid parameters provided for assertion verification.");
//   }

//   const { response, id } = assertion;

//   try {
//     // Verifying the assertion with the stored public key and credential ID
//     const isValid = webauthn.verifyAssertion({
//       assertion: response,
//       publicKey: storedPublicKey,
//       credentialId: storedCredentialId,
//     });

//     return isValid;
//   } catch (error) {
//     console.error("Error during WebAuthn assertion verification:", error);
//     return false;
//   }
// }

// module.exports = { verifyAssertion };
