const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.ID_GOOGLE_CLIENT);

const googleVerify = async(idToken) => {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.ID_GOOGLE_CLIENT
  });

  const {name, email, picture} = ticket.getPayload();

  return {nombre:name, email, img:picture, google:true}
}

module.exports = {
    googleVerify
}