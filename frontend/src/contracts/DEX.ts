import { ethers } from "ethers";
import DEX_ABI from "./DEX.json";
import TOKEN_ABI from "./Token.json";

const DEX_ADDRESS = "0xd8857CF99a87fab4beb5eB78e8EDF81275355a8C";
const TOKEN1_ADDRESS = "0x938432d44F9Ac4Fcee4F26E94e318a347E55507E";
const TOKEN2_ADDRESS = "0x4651e6CaD609D3C6B97EdBa26156FF6D489c630b";

export const getDEXContract = (provider: ethers.providers.Web3Provider) => {
    return new ethers.Contract(DEX_ADDRESS, DEX_ABI, provider.getSigner());
};

export const getToken1Contract = (provider: ethers.providers.Web3Provider) => {
    return new ethers.Contract(TOKEN1_ADDRESS, TOKEN_ABI, provider.getSigner());
};

export const getToken2Contract = (provider: ethers.providers.Web3Provider) => {
    return new ethers.Contract(TOKEN2_ADDRESS, TOKEN_ABI, provider.getSigner());
};
