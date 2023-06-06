import { io } from "socket.io-client";
import { rootApiUrl } from "../environment/Environment";

export const socket = io(rootApiUrl);