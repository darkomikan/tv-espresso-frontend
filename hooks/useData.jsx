import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";

export function useData()
{
    const context = useContext(DataContext);
    return context;
}