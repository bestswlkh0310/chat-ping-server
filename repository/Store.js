/**
 * - id (UUID)
 * - lastActive (Date)
 */
export let onlineUser = [];

export const setOnlineUser = (newOnlineUser) => {
    onlineUser = newOnlineUser;
}

/**
 * - roomId (UUID)
 * - senderId (UUID)
 * - message (str)
 */
export let chatList = [];

export const setChatList = (newChatList) => {
    chatList = newChatList;
}

/**
 * - id (UUID)
 * - member1 (UUID)
 * - member2 (UUID)
 */
export let roomList = {};

export const setRoomList = (newRoomList) => {
    roomList = newRoomList;
}