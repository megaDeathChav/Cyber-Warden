'use client'
import { serverLogs } from "@/data/data";
import { Button, Chip, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import React from "react";


type ServerLog = {
  id: number;
  name: string;
  timestamp: string;
  status: 'signed in' | 'signed out';
}

const PAGE_SIZE = 5; // or whatever size you want

function getPageData(pageNumber: number, pageSize = PAGE_SIZE) {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  const nextCursor = (pageNumber * PAGE_SIZE) < serverLogs.length ? pageNumber + 1 : null;

  return {
    data: serverLogs.slice(start, end),
    nextCursor
  };
}

export function ServerLogsTable() {

  const [logs, setLogs] = React.useState([]) //
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => { //
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/logs/getLogs?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data = await response.json();
        setLogs(data); // Set the fetched data into logs state
      } catch (error) {
        // Handle error (e.g., show a toast notification)
        console.error('Error fetching logs:', error);
      }
      setIsLoading(false);
    };

    fetchLogs();
  }, [page]);

  let list = useAsyncList({
    async load({ signal, cursor }) {
      if (cursor) {
        setPage((prev) => prev + 1);
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const { data, nextCursor } = await getPageData(page);

      if (!cursor) {
        setIsLoading(false);
      }


      return {
        items: data,
        cursor: nextCursor ? nextCursor.toString() : undefined,
      };
    },
  });

  const hasMore = page < 9;

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with client side sorting"
      bottomContent={
        hasMore && !isLoading ? (
          <div className="flex w-full justify-center">
            <Button isDisabled={list.isLoading} variant="flat" onPress={list.loadMore}>
              {list.isLoading && <Spinner color="white" size="sm" />}
              Load More
            </Button>
          </div>
        ) : null
      }
      classNames={{
        td: "dark:bg-[#141B29]",
        wrapper: "max-h-[382px] dark:bg-[#141B29]",
        table: 'min-h-[420px] dark:bg-[#141B29] dark:border-[#141B29]',
        emptyWrapper: 'dark:bg-[#141B29]',
        base: 'max-h-[520px] dark:bg-transparent',
      }}
    >
      <TableHeader>
        <TableColumn key="date">Date</TableColumn>
        <TableColumn key="time">Time</TableColumn>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="status">Status</TableColumn>
        <TableColumn key="module">Module</TableColumn>
        <TableColumn key="content">Log Content</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={logs}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item: ServerLog) => (
          <TableRow key={item.name}>
            {(columnKey) =>
              <TableCell>
                {
                  columnKey === "status" ?
                    <Chip className="capitalize" color={item.status === 'signed in' ? "success" : "danger"} size="sm" variant="flat">
                      {item.status}
                    </Chip>
                    :
                    getKeyValue(item, columnKey)

                }
              </TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

}