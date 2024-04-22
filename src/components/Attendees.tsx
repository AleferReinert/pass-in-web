import { Table } from './table/Table';
import { TableHeader } from './table/TableHeader';
import { TableBody } from './table/TableBody';
import { TableFooterProps } from './table/TableFooter';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import { FiCheck as CheckIcon, FiX as XIcon } from 'react-icons/fi'
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'
import { TableFooter } from './table/TableFooter';
import { PageHeader } from './PageHeader';
import { EventProps } from './Events';
import { Search, SearchProps } from './Search';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import { ComponentProps, useEffect, useState } from 'react';
import Loading from './Loading';
dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export interface AttendeeProps {
    id: number
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

interface AttendeesProps extends Omit<TableFooterProps, 'data'>, SearchProps, ComponentProps<'div'> {
    event: EventProps | undefined
}

export function Attendees({ event, search, onSearchInputChange, itemsPerPage, page, setPage, ...props }: AttendeesProps) {
    const [attendees, setAttendees] = useState<AttendeeProps[]>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const urlAttendees = new URL(`https://pass-in-nodejs.vercel.app/events/${event?.id}/attendees`)
        if(search.length > 0) {
            urlAttendees.searchParams.set('query', search)
        }
        fetch(urlAttendees).then(response => response.json()).then(data => {
            setAttendees(data.attendees)
            setIsLoading(false)
    })
    }, [event?.id, search])

    if(isLoading) {
        return <Loading />
    }

    return (
        <div {...props}>
            <PageHeader
                title={!event ? 'Carregando...' : event.title ?? 'Participantes'}
                description={event?.details}
            />
            {(attendees && attendees.length > 0 || search.length >= 0) && 
                <>
                <Search placeholder='Buscar participante...' search={search} onSearchInputChange={onSearchInputChange} />
                <Table>
                    <TableHeader>
                        <th>
                            <span className='lg:hidden'>ID</span>
                            <span className='hidden lg:inline'>Código</span>
                        </th>
                        <th>Participante</th>
                        <th className='hidden sm:table-cell'>Data da inscrição</th>
                        <th>Check-in</th>
                        <th></th>
                    </TableHeader>
                    <TableBody>
                        {attendees?.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(item => {
                            return (
                                <tr key={item.id}>
                                    <td>
                                        <Checkbox name='item' />
                                    </td>
                                    <td>{item.id}</td>
                                    <td>
                                        <div className='flex flex-col gap-1 self-center'>
                                            <div className='font-semibold text-white'>
                                                {item.name}
                                            </div>
                                            <div className='text-xs -translate-y-1 hidden sm:block'>
                                                {item.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='hidden sm:table-cell'>
                                        {dayjs().to(item.createdAt)}
                                    </td>
                                    <td>
                                        <div className='sm:flex items-center gap-1'>
                                            {item.checkedInAt ?
                                                <>
                                                    <CheckIcon className='text-green-400 inline-block' />
                                                    <span className='hidden md:inline'>
                                                        {dayjs().to(item.checkedInAt)}
                                                    </span>
                                                </>
                                                :
                                                <>
                                                    <XIcon className='text-red-400 inline-block' />
                                                    <span className='hidden md:inline text-zinc-500'>
                                                        Não fez check-in
                                                    </span>
                                                </>
                                            }
                                        </div>
                                    </td>
                                    <td>
                                        <Button children={<ThreeDotsIcon />} bgTransparent />
                                    </td>
                                </tr>
                            );
                        })}
                    </TableBody>
                    <TableFooter data={attendees} page={page} setPage={setPage} itemsPerPage={itemsPerPage} />
                </Table>
                </>
            }
        </div>
    )
}