import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Input, Result, Item, UserProfile } from '../backend';

// Calculation queries
export function useRunCalculation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Result, Error, Input>({
    mutationFn: async (input: Input) => {
      if (!actor) throw new Error('Actor not available');
      return actor.runCalculation(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

// History queries
export function useGetHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Item[]>({
    queryKey: ['history'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetHistoryItem(id: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Item | null>({
    queryKey: ['history', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getHistoryItem(id);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useDeleteHistoryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteHistoryItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

export function useClearHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.clearHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

export function useReRunHistoryItem() {
  const { actor } = useActor();

  return useMutation<Result, Error, bigint>({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reRunHistoryItem(id);
    },
  });
}

// User profile queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, UserProfile>({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
