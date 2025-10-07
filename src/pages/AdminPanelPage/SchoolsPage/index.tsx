import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useContext, useEffect, useState } from 'react';
import { UserRole } from '@/interfaces/IUser';
import EditIcon from '@/assets/edit.svg?react';
import UsersIcon from '@/assets/users.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { AuthContext } from '@/providers/auth.provider';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import { useTranslation } from 'react-i18next';
import { ISchool } from '@/interfaces/companies';
import PlusIcon from '@/assets/plus-sign.svg?react';
import { CompanyModal } from '../CompanyModal';
import AdminCompanyService from '@/api/adminCompany.service';
import { PromoCodesModal } from '../PromoCodesModal';
import PromoCodeService from '@/api/promoCodeService';
import { BulkCodeData } from '../helpers';
import { MembersModal } from '../MembersModal';

export const columns: ColumnDef<ISchool>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Name
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    id: 'seats',
    accessorFn: (row) => (row.maxMembers > 0 ? row.usedMembers / row.maxMembers : 0),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Seats
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { usedMembers, maxMembers } = row.original;
      return (
        <span>
          {usedMembers}/{maxMembers}
        </span>
      );
    },
  },
  {
    id: 'createdDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Created Date
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => {
      if (!row.original.createdAt) return '—';
      const d = new Date(row.original.createdAt);
      const formatted = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
      return <span>{formatted}</span>;
    },
  },
  {
    id: 'redeemCode',
    // accessorFn: (row) => row.promoCount,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Redeem Codes
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    id: 'actions',
    header: '',
  },
];

interface ModalState {
  open: boolean;
  type: 'new' | 'edit' | 'promoCode' | 'members' | 'default';
}

const initModalState: ModalState = {
  open: false,
  type: 'default',
};

const newSchool: Partial<ISchool> = {
  name: '',
  maxMembers: 1,
};

const SchoolsPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [modalState, setIsOpenModal] = useState(initModalState);
  // const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [activeSchool, setActiveSchool] = useState<Partial<ISchool> | null>(null);
  const [schools, setSchools] = useState<ISchool[]>([]);
  const { user } = useContext(AuthContext);

  const { t } = useTranslation('translation', { keyPrefix: 'adminPanel' });
  const navigate = useLocaleNavigate();

  useEffect(() => {
    if (!user || user.role !== UserRole.Admin) {
      navigate('/');
    }
  }, []);

  const table = useReactTable({
    data: schools,
    columns: columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleOpenEditModal = (editSchool: ISchool) => {
    setActiveSchool(editSchool);
    setIsOpenModal({ open: true, type: 'edit' });
  };

  const handleOpenMembersModal = (editSchool: ISchool) => {
    setActiveSchool(editSchool);
    setIsOpenModal({ open: true, type: 'members' });
  };

  const handleOpenPromoCodeModal = (editSchool: ISchool) => {
    setActiveSchool(editSchool);
    setIsOpenModal({ open: true, type: 'promoCode' });
  };

  const handleCreateNewSchool = () => {
    setActiveSchool(newSchool);
    setIsOpenModal({ open: true, type: 'new' });
  };
  const handleCloseEditModal = () => {
    setActiveSchool(null);
    setIsOpenModal(initModalState);
  };

  const handleSaveSchool = async () => {
    if (!activeSchool) return;

    if (activeSchool.id) {
      const editedSchool = await AdminCompanyService.updateSchool(activeSchool.id, {
        name: activeSchool?.name ?? '',
        maxMembers: activeSchool?.maxMembers ?? 1,
      });

      if (!editedSchool) return;
      setSchools((prev) =>
        prev.map((school) => (school.id === editedSchool.id ? editedSchool : school)),
      );
    }

    if (!activeSchool.id) {
      const newSchool = await AdminCompanyService.createSchool({
        name: activeSchool?.name ?? '',
        maxMembers: activeSchool?.maxMembers ?? 1,
      });

      if (!newSchool) return;
      setSchools([newSchool, ...schools]);
    }

    setIsOpenModal(initModalState);
  };

  const handleChangeSchoolField = (
    fildName: 'name' | 'maxMembers' | 'assignedEmail',
    value: string | number,
  ) => {
    if (!activeSchool) {
      return;
    }
    setActiveSchool({
      ...activeSchool,
      name: fildName === 'name' ? String(value) : activeSchool.name,
      maxMembers: fildName === 'maxMembers' ? Number(value) : activeSchool.maxMembers,
    });
  };

  const handleCodeSave = async (schoolId: string, bulkData: BulkCodeData) => {
    await PromoCodeService.createBulk(schoolId, bulkData);
  };

  useEffect(() => {
    const fetchSchools = async () => {
      const schools = await AdminCompanyService.getAllSchools();
      setSchools(schools);
    };

    fetchSchools();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg relative">
      <BaseButton
        onClick={handleCreateNewSchool}
        isDark
        variant="outline"
        size="sm"
        classNames="!hidden md:!flex h-[38px] py-2 px-3 flex gap-1 items-center font-semibold leading-3 bg-white absolute -top-[62px] right-[120px]"
      >
        <PlusIcon />
        {t('createNewBtn')}
      </BaseButton>
      <div className="">
        <div className="flex items-center mb-4">
          <Input
            placeholder="Filter names..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="px-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-[#4B5563] px-0">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id} className="text-[#4B5563] p-2">
                          <div className="ml-4 flex items-center justify-between gap-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}

                            {cell.column.id === 'redeemCode' && (
                              <div className="flex gap-2 w-full">
                                <BaseButton
                                  size="sm"
                                  classNames="p-2"
                                  variant="outline"
                                  onClick={() => handleOpenPromoCodeModal(cell.row.original)}
                                  disabled={false}
                                  icon={
                                    cell.row.original.promoCount > 0 ? <EditIcon /> : <PlusIcon />
                                  }
                                >
                                  {cell.row.original.promoCount > 0 ? 'Edit Codes' : 'Add Codes'}
                                </BaseButton>
                              </div>
                            )}

                            {cell.column.id === 'actions' && (
                              <div className="flex gap-2 justify-end w-full">
                                <BaseButton
                                  size="sm"
                                  classNames="p-2"
                                  variant="outline"
                                  onClick={() => {
                                    handleOpenMembersModal(cell.row.original);
                                  }}
                                >
                                  <UsersIcon />
                                  Users
                                </BaseButton>
                                <BaseButton
                                  size="sm"
                                  classNames="p-2"
                                  variant="ghost"
                                  onClick={() => {
                                    handleOpenEditModal(cell.row.original);
                                  }}
                                  icon={<EditIcon />}
                                />
                              </div>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t('noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {['new', 'edit'].includes(modalState.type) && (
        <CompanyModal
          isModalOpen={modalState.open}
          type={modalState.type as 'new' | 'edit'}
          onModalOpenChange={handleCloseEditModal}
          onSave={handleSaveSchool}
          formData={activeSchool}
          onChangeField={handleChangeSchoolField}
        />
      )}
      {['promoCode'].includes(modalState.type) && activeSchool?.id && (
        <PromoCodesModal
          formData={{ id: activeSchool?.id, label: activeSchool.name ?? '' }}
          isModalOpen={modalState.open}
          onModalOpenChange={handleCloseEditModal}
          onSave={handleCodeSave}
          promoType={'pro'}
        />
      )}
      {['members'].includes(modalState.type) && activeSchool?.id && (
        <MembersModal
          modalData={{
            id: activeSchool?.id,
            title: activeSchool.name ?? '',
            remainingSeats:
              (Number(activeSchool?.maxMembers) || 0) - (Number(activeSchool?.usedMembers) || 0),
          }}
          isModalOpen={modalState.open}
          onModalOpenChange={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default SchoolsPage;
