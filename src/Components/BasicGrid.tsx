import React, {useEffect, useState} from "react";
import { JSX } from "react/jsx-runtime";
import styled from "styled-components";

export interface IGridRowData {
    data: { columnKey: string, value: string }[]
}

export interface IColumn {
    key: string
    columnName: string
    columnDataType: string
}

interface IBasicGrid {
    columns: IColumn[]
    rowData: IGridRowData[]
    nowRowDataMessage?: string
}

const BasicGrid: React.FC<IBasicGrid> = (props) => {
    const [basicGridColumns, setBasicGridColumns] = useState(props.columns)
    const [basicGridRows, setBasicGridRows] = useState<IGridRowData[] | []>([])

    useEffect(() => {
        setBasicGridColumns(props.columns)
    }, [props.columns])

    useEffect(() => {
        setBasicGridRows(props.rowData)
    }, [props.rowData])

    if (props.columns.length === 0) {
        return (
            <BasicGridColumnsWrapperFlexColumn>
                <BasicGridNoData>
                    <p>Grid Has No Columns</p>
                </BasicGridNoData>
            </BasicGridColumnsWrapperFlexColumn>
        )
    }

    const displayJustColumns = () => {
        return (
            <BasicGridColumnsWrapperFlexColumn>
                <BasicGridColumnsWrapper>
                    {basicGridColumns.map((column, index) => {
                        return (
                            <BasicGridColumnData key={column.key + index}>
                                <BasicGridColumn>
                                    <BasicGridColumnText>{column.columnName}</BasicGridColumnText>
                                </BasicGridColumn>
                            </BasicGridColumnData>

                        )
                    })
                    }
                </BasicGridColumnsWrapper>
                <BasicGridNoData>
                    <p>{props.nowRowDataMessage ? props.nowRowDataMessage : "No Grid Data"}</p>
                </BasicGridNoData>
            </BasicGridColumnsWrapperFlexColumn>
        )
    }

    const getRowDataInColumnOrder = (row: any, rowNum: string | number) => {
        const rowToDisplay: JSX.Element[] = []
        basicGridColumns.forEach((column) => {
            const rowDisplay = row.filter((data: any) => {
                console.log(data.columnKey === column.key)
                return data.columnKey === column.key
            })
            console.log(rowDisplay.length)
            if (rowDisplay.length === 0) {
                rowToDisplay.push(
                        <BasicGridColumn key={column.key + rowNum}>
                            <BasicGridRowText>{""}</BasicGridRowText>
                        </BasicGridColumn>
                )
            }
            else {
                rowToDisplay.push(
                        <BasicGridColumn key={column.key + rowNum}>
                            <BasicGridRowText>{rowDisplay[0].value}</BasicGridRowText>
                        </BasicGridColumn>
                )
            }

        })

        return rowToDisplay
    }

    const displayGridData = () => {
        return  (
            <BasicGridColumnsWrapperFlexColumn>
                <BasicGridColumnsWrapper>
                    {basicGridColumns.map((column) => {
                        return (
                                <BasicGridColumn key={column.key}>
                                    <BasicGridColumnText>{column.columnName}</BasicGridColumnText>
                                </BasicGridColumn>
                        )
                    })
                    }
                </BasicGridColumnsWrapper>
                <BasicGridRows>
                    {
                        basicGridRows.map((row, index) => {
                            return (
                                <BasicGridColumnsWrapper key = {index}>
                                    {getRowDataInColumnOrder(row.data, index)}
                                </BasicGridColumnsWrapper>
                            )
                        })
                    }
                </BasicGridRows>
            </BasicGridColumnsWrapperFlexColumn>

        )
    }

    return (
        <BasicGridWrapper>
                {
                    basicGridRows.length > 0 ?
                        displayGridData():
                        displayJustColumns()

                }
        </BasicGridWrapper>
    )
}

const BasicGridWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`
const BasicGridRow = styled.div`
    background-color: white;
    border-style: solid;
    border-width: 1px;
    border-color: darkgray;
`
const BasicGridRowText = styled.p`
    color: black;
`
const BasicGridColumnsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
`
const BasicGridColumnsWrapperFlexColumn = styled(BasicGridWrapper)`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  border-color: black;
  border-width: 1px;
  border-style: solid;
  overflow-y: hidden;
  overflow-x: visible;
  height: 40vh;
  max-height: 70vh;
  width: auto;
`
const BasicGridColumn = styled.div`
    background-color: white;
    border-style: solid;
    border-width: 1px;
    border-color: darkgray;
    width: 100%;
`
const BasicGridColumnText = styled.p`
    color: black;
    font-weight: bold;
    font-size: 1.5rem;
    margin: 1vw
`

const BasicGridColumnData = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`
const BasicGridNoData = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: center;
    min-width: auto;
    min-height: auto;
    background-color: white;
    width: 100%;
    height: 100%;
`

const BasicGridRows = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
`

export default BasicGrid