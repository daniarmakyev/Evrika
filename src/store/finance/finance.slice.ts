import { createSlice } from "@reduxjs/toolkit";
import { PaymentDetail, Check } from "src/consts/types";
import { getMyPayments, getMyChecks } from "./finance.action";

interface FinanceState {
    myPayments: PaymentDetail[] | null;
    myPaymentsLoading: boolean;
    myPaymentsError: boolean;
    myChecks: Check[] | null;
    myChecksLoading: boolean;
    myChecksError: boolean;
}

const INIT_STATE: FinanceState = {
    myPayments: null,
    myPaymentsLoading: false,
    myPaymentsError: false,
    myChecks: null,
    myChecksLoading: false,
    myChecksError: false,
};

export const financeSlice = createSlice({
    name: "finance",
    initialState: INIT_STATE,
    reducers: {

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
            });
    }
});
