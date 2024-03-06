import { Metadata } from 'next';
import Table from '@/app/ui/customers/table';
import {fetchCustomers, fetchFilteredCustomers, fetchCustomersPages} from '@/app/lib/data';
import {InvoicesTableSkeleton} from "@/app/ui/skeletons";
import { Suspense } from 'react';
import Pagination from "@/app/ui/invoices/pagination";

export const metadata: Metadata = {
  title: 'Customers',
};
export default async function Page({ searchParams } : {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  let customers;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomersPages(query);

  if (query) {
    customers = await fetchFilteredCustomers(query, currentPage);
  } else {
    const customersId = await fetchCustomers(currentPage);
    customers = await Promise.all(
      customersId.map(async (id) => {
        const customer = await fetchFilteredCustomers(id.name);
        return customer[0]
      })
    );
  }
  return (
    <div className="w-full">
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table customers={customers} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
