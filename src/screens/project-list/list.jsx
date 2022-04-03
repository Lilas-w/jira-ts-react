import React from "react"
export const List = ({ users, list }) => {
    return <table>
        <thead>
            <tr>
                <th>名称</th>
                <th>负责人</th>
            </tr>
        </thead>
        <tbody>
            {
                list.map(project => <tr key={project.id}>
                    <td>{project.name}</td>
                    {/*后端数据没有直接给personName,用id从users列表中找*/}
                    {/*使用find很容易出现找不到返回undefined，会报错*/}
                    <td>{users.find(user => user.id === project.personId)?.name || '未知'}</td>
                </tr>)
            }
        </tbody>
    </table>
}