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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import UserService from '@/api/userService';
import { toast } from 'sonner';
import { UserConfig, UserRole } from '@/interfaces/IUser';
import EditIcon from '@/assets/edit.svg?react';
import BaseButton from '@/components/CustomUI/BaseButton/BaseButton';
import { AuthContext } from '@/providers/auth.provider';
import useLocaleNavigate from '@/hooks/useLocaleNavigate';
import SubscriptionService from '@/api/subscriptionService';
import { Switch } from '@/components/ui/switch';
import { IOwnedSubscription } from '@/interfaces/ISubscription';
import { useTranslation } from 'react-i18next';
import DeleteConfirmationModal from '@/components/Modals/DeleteConfirmationModal/DeleteConfirmationModal';
import ContinueConfirmationModal from '@/components/Modals/ContinueConfirmationModal/ContinueConfirmationModal';

type ColumnWithAccessorKey<T> = ColumnDef<T> & { accessorKey: keyof T };

export const columns: ColumnWithAccessorKey<UserConfig>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'credits',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Total Credits
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const credits = row.original.credits || 0;
      const extraCredits = row.original.extraCredits || 0;
      return <span>{credits + extraCredits}</span>;
    },
  },
  {
    accessorKey: 'extraPresentationLimit',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Extra Presentations
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          Role
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          isActive
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'ownedSubscription',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="hover:bg-transparent"
        >
          isSubscribed
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
];

enum TableAccessorKey {
  EMAIL = 'email',
  CREDITS = 'credits',
  EXTRA_CREDITS = 'extraCredits',
  EXTRA_PRESENTATIONS = 'extraPresentationLimit',
  ROLE = 'role',
  ISACTIVE = 'isActive',
  SUBSCRIPTION = 'ownedSubscription',
}

const UsersPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showContinueModal, setShowContinueModal] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<Omit<UserConfig, 'email'> | null>(null);
  const [currentUser, setCurrentUser] = useState('');
  const [users, setUsers] = useState<UserConfig[]>([]);
  const { user } = useContext(AuthContext);

  const { t } = useTranslation('translation', { keyPrefix: 'config' });
  const navigate = useLocaleNavigate();

  useEffect(() => {
    if (user && user.role !== UserRole.Support && user.role !== UserRole.Admin) {
      navigate('/');
    }
  }, []);

  const handleUpdateField = async (
    field:
      | TableAccessorKey.CREDITS
      | TableAccessorKey.EXTRA_CREDITS
      | TableAccessorKey.EXTRA_PRESENTATIONS
      | TableAccessorKey.ISACTIVE
      | TableAccessorKey.ROLE,
    value: number | string,
  ) => {
    let validatedValue = value;

    if (
      field === TableAccessorKey.CREDITS ||
      field === TableAccessorKey.EXTRA_CREDITS ||
      field === TableAccessorKey.EXTRA_PRESENTATIONS
    ) {
      validatedValue = isNaN(Number(value)) ? 0 : value;
    }

    if (activeUser) {
      setActiveUser((prev) => {
        if (prev) {
          return { ...prev, [field]: validatedValue };
        }
        return prev;
      });

      const updatedUsers = users.map((user) =>
        user.id === activeUser.id ? { ...user, [field]: validatedValue } : user,
      );
      setUsers(updatedUsers);
    }
  };

  const handleIsActive = async (value: boolean, userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isActive: value } : user,
    );
    setUsers(updatedUsers);

    await UserService.updateUser({
      id: userId,
      isActive: value,
    });
  };

  const handleUserSubscription = async (value: IOwnedSubscription | null, userId: string) => {
    setCurrentUser(userId);
    value ? setShowDeleteModal(true) : setShowContinueModal(true);
  };

  const handleAddSubscription = async () => {
    const subscription = await SubscriptionService.createSubscription(currentUser);
    const updatedUsers = users.map((user) =>
      user.id === currentUser ? { ...user, ownedSubscription: subscription } : user,
    );
    setUsers(updatedUsers as UserConfig[]);
  };

  const handleDeleteSubscription = async () => {
    const updatedUsers = users.map((user) =>
      user.id === currentUser ? { ...user, ownedSubscription: null } : user,
    );
    setUsers(updatedUsers);
    await SubscriptionService.deleteSubscription(currentUser);
  };

  const filteredColumns = columns.filter((column) => {
    if (
      column.accessorKey === TableAccessorKey.ROLE ||
      column.accessorKey === TableAccessorKey.ISACTIVE ||
      column.accessorKey === TableAccessorKey.SUBSCRIPTION
    ) {
      return user?.role === UserRole.Admin;
    }
    return true;
  });

  const table = useReactTable({
    data: users,
    columns: filteredColumns,
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

  const handleUpdateUser = async () => {
    try {
      if (activeUser) {
        const response = await UserService.updateUser(activeUser);
        const updatedUsers = users.map((user) => {
          if (user.id === response.data.id) {
            return {
              ...user,
              ...response.data,
              ownedSubscription: response.data.subscription?.ownedSubscription || null,
            };
          }
          return user;
        });
        setUsers(updatedUsers);
        setIsOpenModal(false);
        toast.success('User updated successfully.');
      }
    } catch (error) {
      toast.error('Failed to update user.');
      console.error(error);
    }
  };

  const handleOpenModal = (
    id: string,
    credits: number,
    extraCredits: number,
    extraPresentationLimit: number,
    isActive: boolean,
    role: string,
    ownedSubscription: IOwnedSubscription | null,
  ) => {
    setActiveUser({
      id,
      credits,
      extraCredits,
      extraPresentationLimit,
      isActive,
      role,
      ownedSubscription,
    });
    setIsOpenModal(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getAllUsers();
        setUsers(response.data);
      } catch (error) {
        toast.error('Failed to fetch users.');
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="">
        <div className="flex items-center mb-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className='px-0'>
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
                      const {
                        id,
                        credits,
                        extraCredits,
                        extraPresentationLimit,
                        isActive,
                        role,
                        ownedSubscription,
                      } = cell.row.original;

                      if (
                        user?.role !== UserRole.Admin &&
                        (cell.column.id === TableAccessorKey.ROLE ||
                          cell.column.id === TableAccessorKey.ISACTIVE)
                      ) {
                        return;
                      }

                      return (
                        <TableCell key={cell.id} className="text-[#4B5563] p-2">
                          <div className="ml-4 flex items-center justify-between gap-2">
                            {cell.column.id === 'isActive' && user?.role === UserRole.Admin && (
                              <Switch
                                id="isActive"
                                checked={isActive}
                                onCheckedChange={() => {
                                  handleIsActive(!isActive, row.original.id);
                                }}
                              />
                            )}

                            {cell.column.id === 'ownedSubscription' &&
                              user?.role === UserRole.Admin && (
                                <Switch
                                  id="ownedSubscription"
                                  checked={!!ownedSubscription}
                                  onCheckedChange={() => {
                                    handleUserSubscription(ownedSubscription, row.original.id);
                                  }}
                                />
                              )}

                            {cell.column.id !== 'ownedSubscription' &&
                              cell.column.id !== 'isActive' &&
                              flexRender(cell.column.columnDef.cell, cell.getContext())}

                            {((user?.role === UserRole.Admin &&
                              cell.column.id === TableAccessorKey.SUBSCRIPTION) ||
                              (user?.role !== UserRole.Admin &&
                                cell.column.id === TableAccessorKey.EXTRA_PRESENTATIONS)) && (
                              <BaseButton
                                size="sm"
                                classNames="p-2"
                                variant="ghost"
                                onClick={() =>
                                  handleOpenModal(
                                    id,
                                    credits,
                                    extraCredits || 0,
                                    extraPresentationLimit,
                                    isActive,
                                    role,
                                    ownedSubscription,
                                  )
                                }
                                icon={<EditIcon />}
                              />
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
          <ContinueConfirmationModal
            open={showContinueModal}
            onOpenChange={() => setShowContinueModal(!showContinueModal)}
            onAction={handleAddSubscription}
            title={t('confirmSubscriptionTitle')}
            description={t('confirmSubscriptionDescription')}
          />
          <DeleteConfirmationModal
            open={showDeleteModal}
            onOpenChange={() => setShowDeleteModal(!showDeleteModal)}
            onAction={handleDeleteSubscription}
            title={t('confirmDeleteSubscriptionTitle')}
            description={t('confirmDeleteSubscriptionDescription')}
          />
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
      <Dialog onOpenChange={setIsOpenModal} open={isOpenModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('changeUserInfo')}</DialogTitle>
            <DialogDescription>{t('changeUserInfoDescription')}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="credits">{t('credits')}</Label>
              <Input
                id="credits"
                value={activeUser?.credits ?? 0}
                onChange={(e) =>
                  handleUpdateField(TableAccessorKey.CREDITS, Number(e.target.value))
                }
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="extraCredits">{t('extraCredits')}</Label>
              <Input
                id="extraCredits"
                value={activeUser?.extraCredits ?? 0}
                onChange={(e) =>
                  handleUpdateField(TableAccessorKey.EXTRA_CREDITS, Number(e.target.value))
                }
              />
            </div>
            <div className="grid flex-1 gap-2">
              <Label htmlFor="extraPresentationLimit">{t('extraPresentations')}</Label>
              <Input
                id="extraPresentationLimit"
                value={activeUser?.extraPresentationLimit ?? 0}
                onChange={(e) =>
                  handleUpdateField(TableAccessorKey.EXTRA_PRESENTATIONS, Number(e.target.value))
                }
              />
            </div>
            {user?.role === UserRole.Admin && (
              <div className="grid flex-1 gap-2">
                <Label htmlFor="extraPresentationLimit">{t('userRole')}</Label>
                <Select
                  onValueChange={(val: string) => handleUpdateField(TableAccessorKey.ROLE, val)}
                  value={activeUser?.role}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-3">
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent align="start" className="w-full">
                    <SelectItem className="w-full" key="user" value="user">
                      <div className={`flex gap-2`}>{t('user')}</div>
                    </SelectItem>
                    <SelectItem className="w-full" key="support" value="support">
                      <div className={`flex gap-2`}>{t('support')}</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-md bg-gray-50 p-3">
            <Label className="text-sm font-medium text-gray-700">
              {t('totalCredits')}: {(activeUser?.credits || 0) + (activeUser?.extraCredits || 0)}
            </Label>
          </div>

          <DialogFooter className="sm:flex sm:justify-end">
            <DialogClose asChild className="sm:w-max">
              <Button type="button" variant="secondary" className="text-black sm:w-max">
                {t('close')}
              </Button>
            </DialogClose>
            <Button type="button" className="sm:w-max" onClick={handleUpdateUser}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
