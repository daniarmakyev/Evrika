import { createSlice } from "@reduxjs/toolkit";
import { PaymentDetail, Check, FinanceItem } from "src/consts/types";
import { getMyPayments, getMyChecks, createCheck, getFinance, getPaymentRequisites, createPaymentRequisite, updatePaymentRequisite } from "./finance.action";

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

interface FinanceState {
    myPayments: PaymentDetail[] | null;
    myPaymentsLoading: boolean;
    myPaymentsError: boolean;
    myChecks: Check[] | null;
    myChecksLoading: boolean;
    myChecksError: boolean;
    createCheckLoading: boolean;
    createCheckError: boolean;
    financeData: FinanceResponse | null;
    financeLoading: boolean;
    financeError: boolean;
    paymentRequisites: PaymentRequisite[] | null;
    paymentRequisitesLoading: boolean;
    paymentRequisitesError: boolean;
    createRequisiteLoading: boolean;
    createRequisiteError: boolean;
    updateRequisiteLoading: boolean;
    updateRequisiteError: boolean;
}

const INIT_STATE: FinanceState = {
    myPayments: null,
    myPaymentsLoading: false,
    myPaymentsError: false,
    myChecks: null,
    myChecksLoading: false,
    myChecksError: false,
    createCheckLoading: false,
    createCheckError: false,
    financeData: null,
    financeLoading: false,
    financeError: false,
    paymentRequisites: null,
    paymentRequisitesLoading: false,
    paymentRequisitesError: false,
    createRequisiteLoading: false,
    createRequisiteError: false,
    updateRequisiteLoading: false,
    updateRequisiteError: false,
};

export const financeSlice = createSlice({
    name: "finance",
    initialState: INIT_STATE,
    reducers: {
        updatePaymentStatus: (state, action) => {
            const { paymentId, newStatus } = action.payload;
            if (state.financeData?.items) {
                const itemIndex = state.financeData.items.findIndex(
                    item => item.payment_detail_id === paymentId
                );
                if (itemIndex !== -1) {
                    state.financeData.items[itemIndex].payment_status = newStatus;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyPayments.pending, (state) => {
                state.myPaymentsLoading = true;
                state.myPaymentsError = false;
            })
            .addCase(getMyPayments.fulfilled, (state, { payload }) => {
                state.myPaymentsLoading = false;
                state.myPayments = payload;
                state.myPaymentsError = false;
            })
            .addCase(getMyPayments.rejected, (state) => {
                state.myPaymentsLoading = false;
                state.myPaymentsError = true;
            })
            .addCase(getMyChecks.pending, (state) => {
                state.myChecksLoading = true;
                state.myChecksError = false;
            })
            .addCase(getMyChecks.fulfilled, (state, { payload }) => {
                state.myChecksLoading = false;
                state.myChecks = payload;
                state.myChecksError = false;
            })
            .addCase(getMyChecks.rejected, (state) => {
                state.myChecksLoading = false;
                state.myChecksError = true;
            })
            .addCase(createCheck.pending, (state) => {
                state.createCheckLoading = true;
                state.createCheckError = false;
            })
            .addCase(createCheck.fulfilled, (state) => {
                state.createCheckLoading = false;
                state.createCheckError = false;
            })
            .addCase(createCheck.rejected, (state) => {
                state.createCheckLoading = false;
                state.createCheckError = true;
            })
            .addCase(getFinance.pending, (state) => {
                state.financeLoading = true;
                state.financeError = false;
            })
            .addCase(getFinance.fulfilled, (state, { payload }) => {
                state.financeLoading = false;
                state.financeData = payload;
                state.financeError = false;
            })
            .addCase(getFinance.rejected, (state) => {
                state.financeLoading = false;
                state.financeError = true;
            })
            .addCase(getPaymentRequisites.pending, (state) => {
                state.paymentRequisitesLoading = true;
                state.paymentRequisitesError = false;
            })
            .addCase(getPaymentRequisites.fulfilled, (state, { payload }) => {
                state.paymentRequisitesLoading = false;
                state.paymentRequisites = payload;
                state.paymentRequisitesError = false;
            })
            .addCase(getPaymentRequisites.rejected, (state) => {
                state.paymentRequisitesLoading = false;
                state.paymentRequisitesError = true;
            })
            .addCase(createPaymentRequisite.pending, (state) => {
                state.createRequisiteLoading = true;
                state.createRequisiteError = false;
            })
            .addCase(createPaymentRequisite.fulfilled, (state) => {
                state.createRequisiteLoading = false;
                state.createRequisiteError = false;

            })
            .addCase(createPaymentRequisite.rejected, (state) => {
                state.createRequisiteLoading = false;
                state.createRequisiteError = true;
            })
            .addCase(updatePaymentRequisite.pending, (state) => {
                state.updateRequisiteLoading = true;
                state.updateRequisiteError = false;
            })
            .addCase(updatePaymentRequisite.fulfilled, (state) => {
                state.updateRequisiteLoading = false;
                state.updateRequisiteError = false;

            })
            .addCase(updatePaymentRequisite.rejected, (state) => {
                state.updateRequisiteLoading = false;
                state.updateRequisiteError = true;
            });
    }
});

export const { updatePaymentStatus } = financeSlice.actions;