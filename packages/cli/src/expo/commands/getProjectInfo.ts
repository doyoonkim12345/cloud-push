import { execa } from "execa"

interface EasProjectInfo {
    ID: string
    fullName: string
}

export const getProjectInfo = async () => {
    const { stdout } = await execa`eas project:info`

    const lines = stdout.split('\n').filter(Boolean)


    const projectInfo = (Object.fromEntries(
        lines.map(l => {
            const [key, ...rest] = l.trim().split(/\s+/)
            return [key, rest.join(' ')]
        })
    )) as unknown as EasProjectInfo

    return projectInfo
}