import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { $apiPrivate } from "src/consts/api";
import { CustomApiError, PaymentDetail, Check, FinanceItem } from "src/consts/types";

interface PaymentRequisite {
    id: number;
    bank_name: string;
    account: string;
    qr: string;
}

interface FinanceResponse {
    items: FinanceItem[];
    pagination: {
        current_page_size: number;
        current_page: number;
        total_pages: number;
    };
}

interface GetFinanceParams {
    group_id?: number;
    search?: string;
    page?: number;
    size?: number;
}

interface CreatePaymentRequisiteParams {
    bank_name: string;
    account: string;
    qr: File;
}

interface UpdatePaymentRequisiteParams {
    requisite_id: number;
    bank_name?: string;
    account?: string;
    qr?: File;
}

interface UpdateCheckParams {
    check_id: number;
    file: File;
    group_id?: number;
}

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

export const createCheck = createAsyncThunk<
    Check,
    { file: File; group_id: number },
    { rejectValue: string }
>(
    "finance/createCheck",
    async ({ file, group_id }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('check', file);

            const response = await $apiPrivate.post<Check>(
                `/checks/?group_id=${group_id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка создания чека"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const updateCheck = createAsyncThunk<
    Check,
    UpdateCheckParams,
    { rejectValue: string }
>(
    "finance/updateCheck",
    async ({ check_id, file, group_id }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const searchParams = new URLSearchParams();
            if (group_id) {
                searchParams.append('group_id', group_id.toString());
            }

            const queryString = searchParams.toString();
            const url = `/checks/${check_id}${queryString ? `?${queryString}` : ''}`;

            const response = await $apiPrivate.patch<Check>(
                url,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.status === 404) {
                    return rejectWithValue("Check not found");
                }
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка обновления чека"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const downloadCheck = createAsyncThunk<
    void,
    { check_id: number; filename?: string },
    { rejectValue: string }
>(
    "finance/downloadCheck",
    async ({ check_id, filename }, { rejectWithValue }) => {
        try {
            const response = await $apiPrivate.get(
                `/checks/${check_id}/download`,
                {
                    responseType: 'blob',
                }
            );

            let downloadFilename = filename || `check_${check_id}`;

            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    downloadFilename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.status === 404) {
                    return rejectWithValue("Файл не найден");
                }
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка при скачивании файла"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const deleteCheck = createAsyncThunk<
    void,
    number,
    { rejectValue: string }
>(
    "finance/deleteCheck",
    async (check_id, { rejectWithValue }) => {
        try {
            await $apiPrivate.delete(`/checks/${check_id}`);
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.status === 404) {
                    return rejectWithValue("Чек не найден");
                }
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка при удалении чека"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const getFinance = createAsyncThunk<
    FinanceResponse,
    GetFinanceParams,
    { rejectValue: string }
>(
    "finance/getFinance",
    async (params, { rejectWithValue }) => {
        try {
            const searchParams = new URLSearchParams();

            if (params.group_id) {
                searchParams.append('group_id', params.group_id.toString());
            }
            if (params.search) {
                searchParams.append('search', params.search);
            }
            if (params.page) {
                searchParams.append('page', params.page.toString());
            }
            if (params.size) {
                searchParams.append('size', params.size.toString());
            }

            const queryString = searchParams.toString();
            const url = `/finance${queryString ? `?${queryString}` : ''}`;

            const response = await $apiPrivate.get<FinanceResponse>(url);

            return response.data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.status === 404) {
                    return rejectWithValue("Finance data not found");
                }
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка получения финансовых данных"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const editFinanceStatus = createAsyncThunk<
    PaymentDetail[],
    {
        payments_id: number | string;
        group_id: number | string;
        student_id: number | string;
        data: {
            current_month_number: number | string;
            months_paid: number | string;
            status: "Оплачено" | "Не оплачено";
        };
    },
    { rejectValue: string }
>(
    "finance/editFinanceStatus",
    async ({ payments_id, group_id, student_id, data }, { rejectWithValue }) => {
        try {
            const response = await $apiPrivate.patch<PaymentDetail[]>(
                `/payment_details/?payment_id=${payments_id}&group_id=${group_id}&student_id=${student_id}`,
                data
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

export const getPaymentRequisites = createAsyncThunk<
    PaymentRequisite[],
    void,
    { rejectValue: string }
>(
    "finance/getPaymentRequisites",
    async (_, { rejectWithValue }) => {
        try {
            const response = await $apiPrivate.get<PaymentRequisite[]>('/payment_requisites/');
            return response.data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.status === 404) {
                    return rejectWithValue("Payment requisites not found");
                }
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка получения реквизитов"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const createPaymentRequisite = createAsyncThunk<
    PaymentRequisite,
    CreatePaymentRequisiteParams,
    { rejectValue: string }
>(
    "finance/createPaymentRequisite",
    async ({ bank_name, account, qr }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('bank_name', bank_name);
            formData.append('account', account);
            formData.append('qr', qr);

            const response = await $apiPrivate.post<PaymentRequisite>(
                '/payment_requisites/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка создания реквизитов"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);

export const updatePaymentRequisite = createAsyncThunk<
    PaymentRequisite,
    UpdatePaymentRequisiteParams,
    { rejectValue: string }
>(
    "finance/updatePaymentRequisite",
    async ({ requisite_id, bank_name, account, qr }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            if (bank_name !== undefined) {
                formData.append('bank_name', bank_name);
            }
            if (account !== undefined) {
                formData.append('account', account);
            }
            if (qr !== undefined) {
                formData.append('qr', qr);
            }

            const response = await $apiPrivate.patch<PaymentRequisite>(
                `/payment_requisites/${requisite_id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            return response.data;
        } catch (err) {
            if (axios.isAxiosError<CustomApiError>(err)) {
                if (err.response?.status === 404) {
                    return rejectWithValue("Payment requisite not found");
                }
                return rejectWithValue(
                    err.response?.data.detail || "Ошибка обновления реквизитов"
                );
            }
            return rejectWithValue("Неизвестная ошибка!");
        }
    }
);