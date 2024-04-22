class TimeoutScheduler {
    handleTimeout = () => {
        // const timeoutUser = Repository.findTimeoutUser()
        // timeoutUser.forEach(user => {
            // const room = Repository.getRoomById(user.id);
            // if (room) {
            //     const {member1, member2} = room;
                // io.emit("cancel", {
                //     member1,
                //     member2
                // });
                // Repository.deleteRoomByUserId(user.id);
        //     }
        // });
        // Repository.deleteTimeOutUser();
    }
}

export default new TimeoutScheduler();