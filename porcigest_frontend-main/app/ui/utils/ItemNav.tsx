"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ItemNavProps {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const ItemNav = ({ label, path, icon }: ItemNavProps) => {
  const pathName = usePathname();
  return (
    <li className={`py-3 px-2 ${pathName == path ? 'font-bold text-accent': ''}`}>
      <Link href={path} className={`flex items-center flex-col-reverse`}>
        {label} {icon}
      </Link>
    </li>
  );
};

export default ItemNav;
