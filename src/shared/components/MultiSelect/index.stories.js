import "@styles/themes.css";
import "../../index.css";

import MultiSelect from "@components/MultiSelect";

export default {
    title: "MultiSelect",
    component: MultiSelect,
};

const Template = (args) => <MultiSelect {...args} />;

export const Normal = Template.bind({});
