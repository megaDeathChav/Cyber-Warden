
import React from "react";


import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Spinner,
  getKeyValue
} from "@nextui-org/react";
import {PlusIcon} from "@/icons/PlusIcon";
import {VerticalDotsIcon} from "@/icons/VerticalDotsIcon";
import {ChevronDownIcon} from "@/icons/ChevronDownIcon";
import {SearchIcon} from "@/icons/SearchIcon";
import {columns, hosts, statusOptions, serverLogs} from "@/data/data";
import {capitalize} from "@/utils/utils";
import Image from "next/image";
// import { getPageData } from "@/actions/serverActions";

const statusColorMap: Record<string, ChipProps["color"]> = {
  connected: "success",
  disconnected: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["hostname", "ip", "os", "incidents", "status", "actions"];


type Host = typeof hosts[0];

type DatagridProps = {
  handleDialogOpen: () => void;
};

export function HostsTable({handleDialogOpen}: DatagridProps) {

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredHosts = [...hosts];

    if (hasSearchFilter) {
      filteredHosts = filteredHosts.filter((user) =>
        user.hostname.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredHosts = filteredHosts.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredHosts;
  }, [hosts, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);

  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Host, b: Host) => {
      const first = a[sortDescriptor.column as keyof Host] as number;
      const second = b[sortDescriptor.column as keyof Host] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((host: Host, columnKey: React.Key) => {
    const cellValue = host[columnKey as keyof Host];

    switch (columnKey) {
        case "os":
          return (
            <div className="flex flex-col ">
              <Image alt='OS Img' width={40} height={40} src={cellValue.toString().toLowerCase() === 'windows' ? '/assets/windows.png' : '/assets/linux.png'} />
            </div>
          );
        case "hostname":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "ip":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "incidents":
          return (
            <div className="flex pl-6">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "status":
          return (
            <Chip className="capitalize" color={statusColorMap[host.status]} size="sm" variant="flat">
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={handleDialogOpen}>View</DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between gap-3 items-end ">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}  
          />
          <div className="flex gap-3 ">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {hosts.length} hosts</span>
          <label className="flex color-black items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    hosts.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2 ">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (

    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      // style={{ backgroundColor: 'white' }}
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        // th: "dark:bg-[#24344E]",
        td: "dark:bg-[#141B29]",
        wrapper: "max-h-[382px] dark:bg-[#141B29]",
        table: 'dark:bg-[#141B29] dark:border-[#141B29]',
        emptyWrapper: 'dark:bg-[#141B29]',
        base: 'dark:bg-transparent',
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns} className="dark:bg-[#24344E]">
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            className={`${column.uid === "actions" ? "text-center " : ''} ${column.uid === "os" ? "pl-6" : ''} `}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      
      <TableBody emptyContent={"No hosts found"} items={sortedItems} className="">
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

