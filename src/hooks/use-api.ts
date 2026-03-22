import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMetrics() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: api.getMetrics,
  });
}

export function useAnalytics(period?: string) {
  return useQuery({
    queryKey: ["analytics", period],
    queryFn: () => api.getAnalytics(period),
  });
}

export function useForecast() {
  return useQuery({
    queryKey: ["forecast"],
    queryFn: api.getForecast,
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: api.getRecommendations,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: api.getAlerts,
  });
}

export function useSendChat() {
  return useMutation({
    mutationFn: (message: string) => api.sendChatMessage(message),
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.acknowledgeAlert(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useUpdateRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "accepted" | "dismissed" }) =>
      api.updateRecommendation(id, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recommendations"] }),
  });
}
