import React, { useEffect, useState } from "react"

export const SearchPanel = ({ users, param, setParam }) => {

    return <form>
        <div>
            <input type="text" value={param.name} onChange={e => setParam({
                ...param,
                name: e.target.value
            })} />
            {/*下拉框*/}
            <select value={param.personId} onChange={e => setParam({
                ...param,
                personId: e.target.value
            })}>
                <option value={''}>负责人</option>
                {
                    users.map(user => <option value={user.id} key={user.id}>{user.name}</option>)
                }
            </select>
        </div>
    </form>
}