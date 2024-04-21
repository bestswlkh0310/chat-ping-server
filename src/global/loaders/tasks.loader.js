import schedule from "node-schedule";
import TimeoutScheduler from "../tasks/timeout.scheduler.js";


class TasksLoaders {
    static async init() {
        schedule.scheduleJob('*/6 * * * * *', async () => {
            TimeoutScheduler.handleTimeout();
        });
    }
}

export default TasksLoaders;