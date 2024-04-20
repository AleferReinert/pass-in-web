import { TableProps } from './Table';
import { Checkbox } from './Checkbox';
import { TableCheckIn } from './TableCheckIn';
import { Button } from './Button';
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export interface AttendeeProps {
    id: number
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

interface AttendeesProps extends Pick<TableProps, 'page' | 'itemsPerPage'> {
    attendees: AttendeeProps[] | undefined
}

// Retorna a lista de participantes para dentro da tabela
export function Attendees({ attendees, page, itemsPerPage }: AttendeesProps) {

    return (
        <>
            {attendees?.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(attendee =>{
                const createdAt = dayjs().to(attendee.createdAt)
                const checkedInAt = attendee.checkedInAt !== null ? dayjs().to(attendee.checkedInAt) : ''

                return (
                    <tr key={attendee.id}>
                        <td>
                            <Checkbox name='item' />
                        </td>
                        <td>{attendee.id}</td>
                        <td>
                            <div className='flex flex-col gap-1 self-center'>
                                <div className='font-semibold text-white'>
                                    {attendee.name}
                                </div>
                                <div className='text-xs -translate-y-1'>
                                    {attendee.email}
                                </div>
                            </div>
                        </td>
                        <td>{createdAt}</td>
                        <td>
                            <TableCheckIn date={checkedInAt} />
                        </td>
                        <td>
                            <Button children={<ThreeDotsIcon />} />
                        </td>
                    </tr>
                )
            })}
        </>
    )
}