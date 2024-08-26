class InstanceBuilder {
    constructor() {}

    build_instance_views(instance_paths) {
        INSTANCE_VIEWS = [];
        let idx = 0;
        for (let instance_path of instance_paths) {
            const instance_view = this.build_instance_view(instance_path, idx);
            INSTANCE_VIEWS.push(instance_view);
            idx += 1;
        }
        return INSTANCE_VIEWS;
    }

    build_instance_view(instance_path, idx) {
        const instance_view = document.createElement("div");
        instance_view.classList.add("instance_view");

        const instance_vis_view = this.build_instance_vis_view(
            instance_path,
            idx
        );
        const input_view = this.build_input_view();

        instance_view.appendChild(instance_vis_view);
        instance_view.appendChild(input_view);

        return instance_view;
    }

    build_common_name_view() {
        const common_name_view = document.createElement("div");
        common_name_view.classList.add("common_name_view");

        const common_name_label = document.createElement("label");
        common_name_label.innerHTML = "Common Name";

        const common_name_input = document.createElement("input");
        common_name_input.setAttribute("type", "text");
        common_name_input.setAttribute("placeholder", "Common Name");
        common_name_input.setAttribute("name", "common_name");

        common_name_view.appendChild(common_name_label);
        common_name_view.appendChild(common_name_input);

        return common_name_view;
    }

    build_sci_name_view() {
        const sci_name_view = document.createElement("div");
        sci_name_view.classList.add("sci_name_view");

        const sci_name_label = document.createElement("label");
        sci_name_label.innerHTML = "Scientific Name";

        const sci_name_input = document.createElement("input");
        sci_name_input.setAttribute("type", "text");
        sci_name_input.setAttribute("placeholder", "Scientific Name");
        sci_name_input.setAttribute("name", "sci_name");

        sci_name_view.appendChild(sci_name_label);
        sci_name_view.appendChild(sci_name_input);

        return sci_name_view;
    }

    build_name_view() {
        const name_view = document.createElement("div");
        name_view.classList.add("name_view");

        const common_name_view = this.build_common_name_view();
        const sci_name_view = this.build_sci_name_view();

        name_view.appendChild(common_name_view);
        name_view.appendChild(sci_name_view);

        return name_view;
    }

    build_behavior_view() {
        const behavior_view = document.createElement("div");
        behavior_view.classList.add("behavior_view");

        const behavior_label = document.createElement("label");
        behavior_label.innerHTML = "Behavior";

        const behavior_input = document.createElement("textarea");
        behavior_input.setAttribute("type", "text");
        behavior_input.setAttribute("placeholder", "Behavior");
        behavior_input.setAttribute("name", "behavior");

        behavior_view.appendChild(behavior_label);
        behavior_view.appendChild(behavior_input);

        return behavior_view;
    }

    build_input_view() {
        const input_view = document.createElement("div");
        input_view.classList.add("input_view");

        const name_view = this.build_name_view();
        const behavior_view = this.build_behavior_view();

        input_view.appendChild(name_view);
        input_view.appendChild(behavior_view);

        return input_view;
    }

    build_instance_vis_view(instance_path, idx) {
        const instance_vis_view = document.createElement("div");
        instance_vis_view.classList.add("instance_vis_view");

        const instance_text = document.createElement("div");
        instance_text.innerHTML = "Creature " + (idx + 1);

        const instance_image = document.createElement("img");
        instance_image.src = instance_path;

        instance_vis_view.appendChild(instance_text);
        instance_vis_view.appendChild(instance_image);

        return instance_vis_view;
    }
}
