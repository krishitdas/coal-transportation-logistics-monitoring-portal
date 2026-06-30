import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import type { UserCreateInput, UserUpdateInput } from '@/types/user.types';
import { toast } from '@/components/ui/toast';

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: () => userService.getUsers() });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UserCreateInput) => userService.createUser(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast({ title: 'User Created', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to create user.', variant: 'destructive' }); },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UserUpdateInput }) => userService.updateUser(id, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast({ title: 'User Updated', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to update user.', variant: 'destructive' }); },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast({ title: 'User Deleted', variant: 'success' }); },
    onError: () => { toast({ title: 'Error', description: 'Failed to delete user.', variant: 'destructive' }); },
  });
}
