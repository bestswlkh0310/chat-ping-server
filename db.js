/**
 * key: id (UUID)
 * value:
 * - lastActive (Date)
 */
export let onlineUser = {};

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
 * key: roomId (UUID)
 * value:
 * - member1 (UUID)
 * - member2 (UUID)
 */
export let roomList = {};

export const setRoomList = (newRoomList) => {
    roomList = newRoomList;
}