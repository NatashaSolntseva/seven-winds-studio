import axios from "axios";
import { InitialRowData, NewNodeDataAPI } from "./types";
import { BASE_URL } from "../../utils/const/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTreeRows = createAsyncThunk(
  "row/getTreeRows",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<InitialRowData[]>(
        `${BASE_URL}/v1/outlay-rows/entity/126491/row/list`
      );
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data ?? "Unknown error");
      } else {
        return rejectWithValue("Unknown error");
      }
    }
  }
);

export const createRow = createAsyncThunk(
  "row/createRow",
  async (
    {
      parentId,
      tempId,
      newRow,
    }: {
      parentId: number | null | undefined;
      tempId: number;
      newRow: NewNodeDataAPI;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/v1/outlay-rows/entity/126491/row/create`,
        newRow
      );
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data ?? "Unknown error");
      } else {
        return rejectWithValue("Unknown error");
      }
    }
  }
);

export const updateRow = createAsyncThunk(
  "row/updateRow",
  async (
    { rowId, updatedData }: { rowId: number; updatedData: NewNodeDataAPI },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/v1/outlay-rows/entity/126491/row/${rowId}/update`,
        updatedData
      );
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data ?? "Unknown error");
      } else {
        return rejectWithValue("Unknown error");
      }
    }
  }
);

export const deleteRowAndChild = createAsyncThunk(
  "row/deleteRowAndChild",
  async (rowId: number, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/v1/outlay-rows/entity/126491/row/${rowId}/delete`
      );
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data ?? "Unknown error");
      } else {
        return rejectWithValue("Unknown error");
      }
    }
  }
);
