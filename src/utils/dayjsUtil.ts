import dayjs, { Dayjs } from "dayjs";

const _formatTemplate = "YYYY-MM-DD HH:mm:ss";

export function dayjsGetNow() {
    return dayjs().format(_formatTemplate);
}

export function dayjsGetFormat(data: string | Dayjs) {
    return dayjs(data).format(_formatTemplate);
}