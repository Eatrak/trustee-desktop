import "@styles/themes.css";
import "../../index.css";

import InputTextField from "@shared/components/InputTextField";

export default {
    title: "InputTextField",
    component: InputTextField,
};

const Template = (args) => <InputTextField {...args} />;

export const Normal = Template.bind({});
Normal.args = {
    title: "Email",
    placeholder: "johndoe@test.com",
};
