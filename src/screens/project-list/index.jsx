import { List } from "./list"
import { SearchPanel } from "./search-panel"
import React, { useState, useEffect } from "react";
import { cleanObject, useMount, useDebounce } from "../../utils";
import * as qs from 'qs';

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
    //项目名和负责人id合并为一个state
    const [param, setParam] = useState({
        name: '',
        personId: ''
    });
    const debouncedParam = useDebounce(param, 2000);
    //工程列表
    const [list, setList] = useState([]);
    //负责人列表
    const [users, setUsers] = useState([]);

    //debouncedParam变化时（输入名称，或选择下拉框中的user）请求项目列表的接口
    useEffect(() => {
        fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`).then(async response => {
            //请求成功
            if (response.ok) {
                setList(await response.json())
            }
        })
    }, [debouncedParam])

    //页面渲染时触发一次
    useMount(() => {
        fetch(`${apiUrl}/users`).then(async response => {
            if (response.ok) {
                setUsers(await response.json())
            }
        })
    })

    return <div>
        <SearchPanel param={param} setParam={setParam} users={users} />
        <List list={list} users={users} />
    </div>
}