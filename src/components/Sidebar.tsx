'use client';

import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
} from "@material-tailwind/react";

import type { CardProps } from "@material-tailwind/react";

import {
  PresentationChartBarIcon,
  NewspaperIcon,
  HomeModernIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  PencilIcon,
  ShieldExclamationIcon,
  
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { ProfileMenu } from './ProfileMenu'; 
import ThemeSwitcher from "./ThemeSwitcher";
import { DialogCustomAnimation } from "./Dialoge";

export function SidebarWithLogo() {
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const [tableOpen, setTableOpen] = React.useState(false);
  const handleTableOpen = () => setTableOpen(!tableOpen);
 
  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <Card variant="gradient" className="rounded-none h-screen max-w-[20rem] bg-gray-600/30 fixed top-0 left-0 shadow-2xl bg-gray-200 shadow-black dark:bg-[#141B29]">
      <div className="mb-2 flex items-center gap-4 p-4">
        <img src="/assets/logo.png" alt="brand" className="h-14 w-14" /> 
        <Typography variant="h5" color="blue-gray" className="text-black dark:text-gray-200">
          Cyber Warden
        </Typography>
      </div>
      <List>
        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
        <Link href='/' className="flex items-center">
          <HomeModernIcon className="h-6 w-6 text-blue-600 dark:text-[#df8c8c]" />
          <span className="ml-2 font-normal text-black dark:text-gray-200">
              Dashboard
         </span>
        </Link>
        </button>

        <button className="py-2 px-4 rounded-md hover:bg-blue-100 hover:dark:bg-purple-900 w-full text-left">
        <Link href='/serverLogs' className="flex items-center">
          <PencilSquareIcon className="h-6 w-6 text-blue-600 dark:text-[#df8c8c]" />
          <span className="ml-2 font-normal text-black dark:text-gray-200">
            Server Logs
          </span>
        </Link>
        </button>
      </List>
      
      <List className="flex justify-end h-full mb-6">
        <ListItem className='text-black hover:bg-blue-200 dark:text-gray-200 hover:dark:bg-purple-900'>
          <ThemeSwitcher />
        </ListItem>
        <ListItem className='text-black hover:bg-blue-200 dark:text-gray-200 hover:dark:bg-purple-900'>
          <ListItemPrefix>
            <ExclamationTriangleIcon className="h-7 w-7 text-yellow-900 dark:text-red-700" />
          </ListItemPrefix>
          Alerts
          <ListItemSuffix>
            <Chip value="14" size="sm" variant="ghost" color="red" className="rounded-full text-orange-900 dark:text-red-400" />
          </ListItemSuffix>
        </ListItem>
        {/* <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem> */}
        <ProfileMenu />
        {/* <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <Link href='/login'>
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </Link> */}
      </List>
      <Alert open={openAlert} className="mt-auto w-56 m-6 dark:bg-white/60 dark:text-black" onClose={() => setOpenAlert(false)}>
        <CubeTransparentIcon className="mb-4 h-12 w-12 dark:text-black" />
        <Typography variant="h6" className="mb-1 dark:text-black">
          Welcome to Cyber Warden !
        </Typography>
        <Typography variant="small" className="font-normal opacity-80 dark:text-black">
          The capabilities of this platform are at you fingertips...
        </Typography>
        <div className="mt-4 flex gap-3">
          <Typography
            as="a"
            href="#"
            variant="small"
            className="font-medium opacity-80 dark:text-black"
            onClick={() => setOpenAlert(false)}
          >
            Dismiss
          </Typography>
          <Typography as="a" href="#" variant="small" className="font-medium dark:text-black">
            I&apos;m Excited
          </Typography>
        </div>
      </Alert>
    </Card>
  );
}