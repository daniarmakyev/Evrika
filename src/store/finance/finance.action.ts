import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { CustomApiError, PaymentDetail, Check } from "src/consts/types";

export const getMyPayments = createAsyncThunk<
    PaymentDetail[],
    "Оплачено" | "Не оплачено" | undefined,
    { rejectValue: string }
>(
    "finance/getMyPayments",
    async (status, { rejectWithValue }) => {
        try {
            const response = status
                ? await $apiPrivate.get<PaymentDetail[]>(
                    `/payment_details/my_payments?payment_status=${status}`
                )
                : await $apiPrivate.get<PaymentDetail[]>(
                    `/payment_details/my_payments`
                );

            return response.data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.status === 404) {
                    return rejectWithValue("Payments not found");
                }
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка получения платежей"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const getMyChecks = createAsyncThunk<
    Check[],
    number | undefined,
    { rejectValue: string }
>(
    "finance/getMyChecks",
    async (group_id, { rejectWithValue }) => {
        try {
            const response = group_id
                ? await $apiPrivate.get<Check[]>(
                    `/checks/my?group_id=${group_id}`
                )
                : await $apiPrivate.get<Check[]>(
                    `/checks/my`
                );

            return response.data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.status === 404) {
                    return rejectWithValue("Checks not found");
                }
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка получения чеков"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);
