import React, { type PropsWithChildren } from 'react';
import { Table, Row, TableTitle, TableTitleText, BaseTouchable, Cell, CellText, InputTable } from '../../styled';
import { IBaseTable, ITitle } from './IBaseTable';
import Util from '../../classes/Utils';
import { Dimensions } from 'react-native';
import dayjs from 'dayjs';
import { Link } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

export function BaseTable(props: IBaseTable) {
    const tableTitles = props.titles;
    let tableWidth = 0;

    tableTitles.map((title: ITitle) => {
        if (title.width) {
            tableWidth += title.width;
        } else if (title.colspan) {
            tableWidth += title.colspan * 100;
        } else {
            tableWidth += 100;
        }

    })
    if (tableWidth < windowWidth) {
        const lastIndex = tableTitles[tableTitles.length - 1];

        tableTitles[tableTitles.length - 1].width = (lastIndex && lastIndex.colspan ? lastIndex.colspan * 100 : 0) + (lastIndex && lastIndex.width ? lastIndex.width : 0) + (windowWidth - tableWidth)
    }

    return (
        <Table background='white'>
            <Row>
                {tableTitles.map((title: ITitle, titleIndex) => (
                    <TableTitle width={title.width} colSpan={title.colspan ? title.colspan : title.colspan} key={titleIndex}><TableTitleText>{props.alt && title.alt ? title.alt : title.title}</TableTitleText></TableTitle>
                ))}
            </Row>
            {props.itens.map((item, itemIndex) => (
                <Row key={itemIndex}>
                    {item.map((field, fieldIndex) => (
                        <React.Fragment key={fieldIndex}>
                            {(field.type == "string" || field.type == "number") &&
                                <Cell width={field.width} colSpan={field.colspan}><CellText>{field.value}</CellText></Cell>
                            }
                            {field.type == "money" &&
                                <Cell width={field.width} colSpan={field.colspan}><CellText>R${field.value ? Util.formatMoney(field.value) : "0,00"}</CellText></Cell>
                            }
                            {field.type == "date" &&
                                <Cell width={field.width} colSpan={field.colspan}><CellText>{dayjs(field.value).format("DD/MM/YYYY")}</CellText></Cell>
                            }
                            {field.type == "link" &&
                                <Cell width={field.width} colSpan={field.colspan}><CellText><Link to={field.link ? field.link : {screen: ""}} style={{ textAlign: "center", minWidth: 50, color: "blue", textDecorationLine: "underline" }}>{field.value}</Link></CellText></Cell>
                            }

                        </React.Fragment>
                    ))}
                </Row>
            )
            )}
        </Table>
    )
}