import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

type Coluna<T> = {
  header: string
  render: (item: T) => React.ReactNode
}

export function DataTable<T extends { id: string }>({
  items,
  colunas,
  editHref,
  vazio = 'Nenhum item cadastrado.',
}: {
  items: T[]
  colunas: Coluna<T>[]
  editHref: (item: T) => string
  vazio?: string
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{vazio}</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {colunas.map((coluna) => (
            <TableHead key={coluna.header}>{coluna.header}</TableHead>
          ))}
          <TableHead className="text-right">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            {colunas.map((coluna) => (
              <TableCell key={coluna.header}>{coluna.render(item)}</TableCell>
            ))}
            <TableCell className="text-right">
              <Button
                render={<Link href={editHref(item)}>Editar</Link>}
                nativeButton={false}
                variant="ghost"
                size="sm"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
