require('dotenv').config();

const jwt = require('jsonwebtoken');
const sqlSelect = require('../data/sqlSelect');

var refreshTokens = [];

function getAccessToken(utilisateur){
    return jwt.sign(utilisateur, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}

function getRefreshToken(utilisateur){
    var refreshToken = jwt.sign(utilisateur, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    refreshTokens.push({
        id: utilisateur.id,
        refreshToken
    });
    return refreshToken;
}

function refreshtoken(token){
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    var  error;
    sqlSelect.select_id_util(decodedToken.id, (result) => {
    }, (er) => {
        error = 'Accès est interdit !';
    })
    if(!error){
        // Vérifier si le refreshToken est associé un utilisateur .
        const userToken = refreshTokens.find((refToken) => refToken.id === decodedToken.id);

        if(!userToken){          
            throw new Error("Aucun token n'est associé à cet utilisateur");
        }

        
        //Vérifier si le refreshToken envoyer par le client existe dans la table de "refreshTokens"
        const refreshCourant = refreshTokens.find((refToken) => refToken.refreshToken === token);
        if(!refreshCourant){
            throw new Error("Refresh token est faux !");
        }
        var accessToken = getAccessToken({ id : decodedToken.id, nom : decodedToken.nom });
        return {
            accessToken
        }
    } else {
        throw new Error(error);
    }

}

module.exports = {
    refreshTokens,
    getAccessToken,
    getRefreshToken,
    refreshtoken
}