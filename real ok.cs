declare const Il2Cpp: any;
declare const console: any;
declare const System: any;
declare const XRNode: any;
declare const Random: any;
declare const UnityEngine: any;

Il2Cpp.$config.exports = {
	il2cpp_init: () => Il2Cpp.module.findExportByName("il2cpp_init"),
	il2cpp_init_utf16: () => Il2Cpp.module.findExportByName("il2cpp_init_utf16"),
	il2cpp_shutdown: () => Il2Cpp.module.findExportByName("il2cpp_shutdown"),
	il2cpp_set_config_dir: () => Il2Cpp.module.findExportByName("il2cpp_set_config_dir"),
	il2cpp_set_data_dir: () => Il2Cpp.module.findExportByName("il2cpp_set_data_dir"),
	il2cpp_set_temp_dir: () => Il2Cpp.module.findExportByName("il2cpp_set_temp_dir"),
	il2cpp_set_commandline_arguments: () => Il2Cpp.module.findExportByName("il2cpp_set_commandline_arguments"),
	il2cpp_set_commandline_arguments_utf16: () => Il2Cpp.module.findExportByName("il2cpp_set_commandline_arguments_utf16"),
	il2cpp_set_config_utf16: () => Il2Cpp.module.findExportByName("il2cpp_set_config_utf16"),
	il2cpp_set_config: () => Il2Cpp.module.findExportByName("il2cpp_set_config"),
	il2cpp_set_memory_callbacks: () => Il2Cpp.module.findExportByName("il2cpp_set_memory_callbacks"),
	il2cpp_memory_pool_set_region_size: () => Il2Cpp.module.findExportByName("il2cpp_memory_pool_set_region_size"),
	il2cpp_memory_pool_get_region_size: () => Il2Cpp.module.findExportByName("il2cpp_memory_pool_get_region_size"),
	il2cpp_get_corlib: () => Il2Cpp.module.findExportByName("il2cpp_get_corlib"),
	il2cpp_add_internal_call: () => Il2Cpp.module.findExportByName("il2cpp_add_internal_call"),
	il2cpp_resolve_icall: () => Il2Cpp.module.findExportByName("il2cpp_resolve_icall"),
	il2cpp_alloc: () => Il2Cpp.module.findExportByName("il2cpp_alloc"),
	il2cpp_free: () => Il2Cpp.module.findExportByName("il2cpp_free"),
	il2cpp_array_class_get: () => Il2Cpp.module.findExportByName("il2cpp_array_class_get"),
	il2cpp_array_length: () => Il2Cpp.module.findExportByName("il2cpp_array_length"),
	il2cpp_array_get_byte_length: () => Il2Cpp.module.findExportByName("il2cpp_array_get_byte_length"),
	il2cpp_array_new: () => Il2Cpp.module.findExportByName("il2cpp_array_new"),
	il2cpp_array_new_specific: () => Il2Cpp.module.findExportByName("il2cpp_array_new_specific"),
	il2cpp_array_new_full: () => Il2Cpp.module.findExportByName("il2cpp_array_new_full"),
	il2cpp_bounded_array_class_get: () => Il2Cpp.module.findExportByName("il2cpp_bounded_array_class_get"),
	il2cpp_array_element_size: () => Il2Cpp.module.findExportByName("il2cpp_array_element_size"),
	il2cpp_assembly_get_image: () => Il2Cpp.module.findExportByName("il2cpp_assembly_get_image"),
	il2cpp_class_enum_basetype: () => Il2Cpp.module.findExportByName("il2cpp_class_enum_basetype"),
	il2cpp_class_from_system_type: () => Il2Cpp.module.findExportByName("il2cpp_class_from_system_type"),
	il2cpp_class_is_inited: () => Il2Cpp.module.findExportByName("il2cpp_class_is_inited"),
	il2cpp_class_is_generic: () => Il2Cpp.module.findExportByName("il2cpp_class_is_generic"),
	il2cpp_class_is_inflated: () => Il2Cpp.module.findExportByName("il2cpp_class_is_inflated"),
	il2cpp_class_is_assignable_from: () => Il2Cpp.module.findExportByName("il2cpp_class_is_assignable_from"),
	il2cpp_class_is_subclass_of: () => Il2Cpp.module.findExportByName("il2cpp_class_is_subclass_of"),
	il2cpp_class_has_parent: () => Il2Cpp.module.findExportByName("il2cpp_class_has_parent"),
	il2cpp_class_from_il2cpp_type: () => Il2Cpp.module.findExportByName("il2cpp_class_from_il2cpp_type"),
	il2cpp_class_from_name: () => Il2Cpp.module.findExportByName("il2cpp_class_from_name"),
	il2cpp_class_get_element_class: () => Il2Cpp.module.findExportByName("il2cpp_class_get_element_class"),
	il2cpp_class_get_events: () => Il2Cpp.module.findExportByName("il2cpp_class_get_events"),
	il2cpp_class_get_fields: () => Il2Cpp.module.findExportByName("il2cpp_class_get_fields"),
	il2cpp_class_get_nested_types: () => Il2Cpp.module.findExportByName("il2cpp_class_get_nested_types"),
	il2cpp_class_get_interfaces: () => Il2Cpp.module.findExportByName("il2cpp_class_get_interfaces"),
	il2cpp_class_get_properties: () => Il2Cpp.module.findExportByName("il2cpp_class_get_properties"),
	il2cpp_class_get_property_from_name: () => Il2Cpp.module.findExportByName("il2cpp_class_get_property_from_name"),
	il2cpp_class_get_field_from_name: () => Il2Cpp.module.findExportByName("il2cpp_class_get_field_from_name"),
	il2cpp_class_get_methods: () => Il2Cpp.module.findExportByName("il2cpp_class_get_methods"),
	il2cpp_class_get_method_from_name: () => Il2Cpp.module.findExportByName("il2cpp_class_get_method_from_name"),
	il2cpp_class_get_name: () => Il2Cpp.module.findExportByName("il2cpp_class_get_name"),
	il2cpp_class_get_namespace: () => Il2Cpp.module.findExportByName("il2cpp_class_get_namespace"),
	il2cpp_class_get_parent: () => Il2Cpp.module.findExportByName("il2cpp_class_get_parent"),
	il2cpp_class_get_declaring_type: () => Il2Cpp.module.findExportByName("il2cpp_class_get_declaring_type"),
	il2cpp_class_instance_size: () => Il2Cpp.module.findExportByName("il2cpp_class_instance_size"),
	il2cpp_class_num_fields: () => Il2Cpp.module.findExportByName("il2cpp_class_num_fields"),
	il2cpp_class_is_valuetype: () => Il2Cpp.module.findExportByName("il2cpp_class_is_valuetype"),
	il2cpp_class_is_blittable: () => Il2Cpp.module.findExportByName("il2cpp_class_is_blittable"),
	il2cpp_class_value_size: () => Il2Cpp.module.findExportByName("il2cpp_class_value_size"),
	il2cpp_class_get_flags: () => Il2Cpp.module.findExportByName("il2cpp_class_get_flags"),
	il2cpp_class_is_abstract: () => Il2Cpp.module.findExportByName("il2cpp_class_is_abstract"),
	il2cpp_class_is_interface: () => Il2Cpp.module.findExportByName("il2cpp_class_is_interface"),
	il2cpp_class_array_element_size: () => Il2Cpp.module.findExportByName("il2cpp_class_array_element_size"),
	il2cpp_class_from_type: () => Il2Cpp.module.findExportByName("il2cpp_class_from_type"),
	il2cpp_class_get_type: () => Il2Cpp.module.findExportByName("il2cpp_class_get_type"),
	il2cpp_class_get_type_token: () => Il2Cpp.module.findExportByName("il2cpp_class_get_type_token"),
	il2cpp_class_has_attribute: () => Il2Cpp.module.findExportByName("il2cpp_class_has_attribute"),
	il2cpp_class_has_references: () => Il2Cpp.module.findExportByName("il2cpp_class_has_references"),
	il2cpp_class_is_enum: () => Il2Cpp.module.findExportByName("il2cpp_class_is_enum"),
	il2cpp_class_get_image: () => Il2Cpp.module.findExportByName("il2cpp_class_get_image"),
	il2cpp_class_get_assemblyname: () => Il2Cpp.module.findExportByName("il2cpp_class_get_assemblyname"),
	il2cpp_class_get_rank: () => Il2Cpp.module.findExportByName("il2cpp_class_get_rank"),
	il2cpp_class_get_data_size: () => Il2Cpp.module.findExportByName("il2cpp_class_get_data_size"),
	il2cpp_class_get_static_field_data: () => Il2Cpp.module.findExportByName("il2cpp_class_get_static_field_data"),
	il2cpp_stats_dump_to_file: () => Il2Cpp.module.findExportByName("il2cpp_stats_dump_to_file"),
	il2cpp_stats_get_value: () => Il2Cpp.module.findExportByName("il2cpp_stats_get_value"),
	il2cpp_domain_get: () => Il2Cpp.module.findExportByName("il2cpp_domain_get"),
	il2cpp_domain_assembly_open: () => Il2Cpp.module.findExportByName("il2cpp_domain_assembly_open"),
	il2cpp_domain_get_assemblies: () => Il2Cpp.module.findExportByName("il2cpp_domain_get_assemblies"),
	il2cpp_raise_exception: () => Il2Cpp.module.findExportByName("il2cpp_raise_exception"),
	il2cpp_exception_from_name_msg: () => Il2Cpp.module.findExportByName("il2cpp_exception_from_name_msg"),
	il2cpp_get_exception_argument_null: () => Il2Cpp.module.findExportByName("il2cpp_get_exception_argument_null"),
	il2cpp_format_exception: () => Il2Cpp.module.findExportByName("il2cpp_format_exception"),
	il2cpp_format_stack_trace: () => Il2Cpp.module.findExportByName("il2cpp_format_stack_trace"),
	il2cpp_unhandled_exception: () => Il2Cpp.module.findExportByName("il2cpp_unhandled_exception"),
	il2cpp_native_stack_trace: () => Il2Cpp.module.findExportByName("il2cpp_native_stack_trace"),
	il2cpp_field_get_name: () => Il2Cpp.module.findExportByName("il2cpp_field_get_name"),
	il2cpp_field_get_flags: () => Il2Cpp.module.findExportByName("il2cpp_field_get_flags"),
	il2cpp_field_get_from_reflection: () => Il2Cpp.module.findExportByName("il2cpp_field_get_from_reflection"),
	il2cpp_field_get_parent: () => Il2Cpp.module.findExportByName("il2cpp_field_get_parent"),
	il2cpp_field_get_object: () => Il2Cpp.module.findExportByName("il2cpp_field_get_object"),
	il2cpp_field_get_offset: () => Il2Cpp.module.findExportByName("il2cpp_field_get_offset"),
	il2cpp_field_get_type: () => Il2Cpp.module.findExportByName("il2cpp_field_get_type"),
	il2cpp_field_get_value: () => Il2Cpp.module.findExportByName("il2cpp_field_get_value"),
	il2cpp_field_get_value_object: () => Il2Cpp.module.findExportByName("il2cpp_field_get_value_object"),
	il2cpp_field_has_attribute: () => Il2Cpp.module.findExportByName("il2cpp_field_has_attribute"),
	il2cpp_field_set_value: () => Il2Cpp.module.findExportByName("il2cpp_field_set_value"),
	il2cpp_field_set_value_object: () => Il2Cpp.module.findExportByName("il2cpp_field_set_value_object"),
	il2cpp_field_static_get_value: () => Il2Cpp.module.findExportByName("il2cpp_field_static_get_value"),
	il2cpp_field_static_set_value: () => Il2Cpp.module.findExportByName("il2cpp_field_static_set_value"),
	il2cpp_field_is_literal: () => Il2Cpp.module.findExportByName("il2cpp_field_is_literal"),
	il2cpp_gc_collect: () => Il2Cpp.module.findExportByName("il2cpp_gc_collect"),
	il2cpp_gc_collect_a_little: () => Il2Cpp.module.findExportByName("il2cpp_gc_collect_a_little"),
	il2cpp_gc_start_incremental_collection: () => Il2Cpp.module.findExportByName("il2cpp_gc_start_incremental_collection"),
	il2cpp_gc_enable: () => Il2Cpp.module.findExportByName("il2cpp_gc_enable"),
	il2cpp_gc_disable: () => Il2Cpp.module.findExportByName("il2cpp_gc_disable"),
	il2cpp_gc_is_disabled: () => Il2Cpp.module.findExportByName("il2cpp_gc_is_disabled"),
	il2cpp_gc_set_mode: () => Il2Cpp.module.findExportByName("il2cpp_gc_set_mode"),
	il2cpp_gc_is_incremental: () => Il2Cpp.module.findExportByName("il2cpp_gc_is_incremental"),
	il2cpp_gc_get_max_time_slice_ns: () => Il2Cpp.module.findExportByName("il2cpp_gc_get_max_time_slice_ns"),
	il2cpp_gc_set_max_time_slice_ns: () => Il2Cpp.module.findExportByName("il2cpp_gc_set_max_time_slice_ns"),
	il2cpp_gc_get_used_size: () => Il2Cpp.module.findExportByName("il2cpp_gc_get_used_size"),
	il2cpp_gc_get_heap_size: () => Il2Cpp.module.findExportByName("il2cpp_gc_get_heap_size"),
	il2cpp_gc_foreach_heap: () => Il2Cpp.module.findExportByName("il2cpp_gc_foreach_heap"),
	il2cpp_stop_gc_world: () => Il2Cpp.module.findExportByName("il2cpp_stop_gc_world"),
	il2cpp_start_gc_world: () => Il2Cpp.module.findExportByName("il2cpp_start_gc_world"),
	il2cpp_gc_alloc_fixed: () => Il2Cpp.module.findExportByName("il2cpp_gc_alloc_fixed"),
	il2cpp_gc_free_fixed: () => Il2Cpp.module.findExportByName("il2cpp_gc_free_fixed"),
	il2cpp_gchandle_new: () => Il2Cpp.module.findExportByName("il2cpp_gchandle_new"),
	il2cpp_gchandle_new_weakref: () => Il2Cpp.module.findExportByName("il2cpp_gchandle_new_weakref"),
	il2cpp_gchandle_get_target: () => Il2Cpp.module.findExportByName("il2cpp_gchandle_get_target"),
	il2cpp_gchandle_foreach_get_target: () => Il2Cpp.module.findExportByName("il2cpp_gchandle_foreach_get_target"),
	il2cpp_gc_wbarrier_set_field: () => Il2Cpp.module.findExportByName("il2cpp_gc_wbarrier_set_field"),
	il2cpp_gc_has_strict_wbarriers: () => Il2Cpp.module.findExportByName("il2cpp_gc_has_strict_wbarriers"),
	il2cpp_gc_set_external_allocation_tracker: () => Il2Cpp.module.findExportByName("il2cpp_gc_set_external_allocation_tracker"),
	il2cpp_gc_set_external_wbarrier_tracker: () => Il2Cpp.module.findExportByName("il2cpp_gc_set_external_wbarrier_tracker"),
	il2cpp_gchandle_free: () => Il2Cpp.module.findExportByName("il2cpp_gchandle_free"),
	il2cpp_object_header_size: () => Il2Cpp.module.findExportByName("il2cpp_object_header_size"),
	il2cpp_array_object_header_size: () => Il2Cpp.module.findExportByName("il2cpp_array_object_header_size"),
	il2cpp_offset_of_array_length_in_array_object_header: () => Il2Cpp.module.findExportByName("il2cpp_offset_of_array_length_in_array_object_header"),
	il2cpp_offset_of_array_bounds_in_array_object_header: () => Il2Cpp.module.findExportByName("il2cpp_offset_of_array_bounds_in_array_object_header"),
	il2cpp_allocation_granularity: () => Il2Cpp.module.findExportByName("il2cpp_allocation_granularity"),
	il2cpp_unity_liveness_allocate_struct: () => Il2Cpp.module.findExportByName("il2cpp_unity_liveness_allocate_struct"),
	il2cpp_unity_liveness_calculation_from_root: () => Il2Cpp.module.findExportByName("il2cpp_unity_liveness_calculation_from_root"),
	il2cpp_unity_liveness_calculation_from_statics: () => Il2Cpp.module.findExportByName("il2cpp_unity_liveness_calculation_from_statics"),
	il2cpp_unity_liveness_finalize: () => Il2Cpp.module.findExportByName("il2cpp_unity_liveness_finalize"),
	il2cpp_unity_liveness_free_struct: () => Il2Cpp.module.findExportByName("il2cpp_unity_liveness_free_struct"),
	il2cpp_method_get_return_type: () => Il2Cpp.module.findExportByName("il2cpp_method_get_return_type"),
	il2cpp_method_get_from_reflection: () => Il2Cpp.module.findExportByName("il2cpp_method_get_from_reflection"),
	il2cpp_method_get_object: () => Il2Cpp.module.findExportByName("il2cpp_method_get_object"),
	il2cpp_method_get_name: () => Il2Cpp.module.findExportByName("il2cpp_method_get_name"),
	il2cpp_method_is_generic: () => Il2Cpp.module.findExportByName("il2cpp_method_is_generic"),
	il2cpp_method_is_inflated: () => Il2Cpp.module.findExportByName("il2cpp_method_is_inflated"),
	il2cpp_method_is_instance: () => Il2Cpp.module.findExportByName("il2cpp_method_is_instance"),
	il2cpp_method_get_param_count: () => Il2Cpp.module.findExportByName("il2cpp_method_get_param_count"),
	il2cpp_method_get_param: () => Il2Cpp.module.findExportByName("il2cpp_method_get_param"),
	il2cpp_method_get_class: () => Il2Cpp.module.findExportByName("il2cpp_method_get_class"),
	il2cpp_method_has_attribute: () => Il2Cpp.module.findExportByName("il2cpp_method_has_attribute"),
	il2cpp_method_get_declaring_type: () => Il2Cpp.module.findExportByName("il2cpp_method_get_declaring_type"),
	il2cpp_method_get_flags: () => Il2Cpp.module.findExportByName("il2cpp_method_get_flags"),
	il2cpp_method_get_token: () => Il2Cpp.module.findExportByName("il2cpp_method_get_token"),
	il2cpp_method_get_param_name: () => Il2Cpp.module.findExportByName("il2cpp_method_get_param_name"),
	il2cpp_profiler_install: () => Il2Cpp.module.findExportByName("il2cpp_profiler_install"),
	il2cpp_profiler_set_events: () => Il2Cpp.module.findExportByName("il2cpp_profiler_set_events"),
	il2cpp_profiler_install_enter_leave: () => Il2Cpp.module.findExportByName("il2cpp_profiler_install_enter_leave"),
	il2cpp_profiler_install_allocation: () => Il2Cpp.module.findExportByName("il2cpp_profiler_install_allocation"),
	il2cpp_profiler_install_gc: () => Il2Cpp.module.findExportByName("il2cpp_profiler_install_gc"),
	il2cpp_profiler_install_fileio: () => Il2Cpp.module.findExportByName("il2cpp_profiler_install_fileio"),
	il2cpp_profiler_install_thread: () => Il2Cpp.module.findExportByName("il2cpp_profiler_install_thread"),
	il2cpp_property_get_name: () => Il2Cpp.module.findExportByName("il2cpp_property_get_name"),
	il2cpp_property_get_get_method: () => Il2Cpp.module.findExportByName("il2cpp_property_get_get_method"),
	il2cpp_property_get_set_method: () => Il2Cpp.module.findExportByName("il2cpp_property_get_set_method"),
	il2cpp_property_get_parent: () => Il2Cpp.module.findExportByName("il2cpp_property_get_parent"),
	il2cpp_property_get_flags: () => Il2Cpp.module.findExportByName("il2cpp_property_get_flags"),
	il2cpp_object_get_class: () => Il2Cpp.module.findExportByName("il2cpp_object_get_class"),
	il2cpp_object_get_size: () => Il2Cpp.module.findExportByName("il2cpp_object_get_size"),
	il2cpp_object_get_virtual_method: () => Il2Cpp.module.findExportByName("il2cpp_object_get_virtual_method"),
	il2cpp_object_new: () => Il2Cpp.module.findExportByName("il2cpp_object_new"),
	il2cpp_object_unbox: () => Il2Cpp.module.findExportByName("il2cpp_object_unbox"),
	il2cpp_value_box: () => Il2Cpp.module.findExportByName("il2cpp_value_box"),
	il2cpp_monitor_enter: () => Il2Cpp.module.findExportByName("il2cpp_monitor_enter"),
	il2cpp_monitor_try_enter: () => Il2Cpp.module.findExportByName("il2cpp_monitor_try_enter"),
	il2cpp_monitor_exit: () => Il2Cpp.module.findExportByName("il2cpp_monitor_exit"),
	il2cpp_monitor_pulse: () => Il2Cpp.module.findExportByName("il2cpp_monitor_pulse"),
	il2cpp_monitor_pulse_all: () => Il2Cpp.module.findExportByName("il2cpp_monitor_pulse_all"),
	il2cpp_monitor_wait: () => Il2Cpp.module.findExportByName("il2cpp_monitor_wait"),
	il2cpp_monitor_try_wait: () => Il2Cpp.module.findExportByName("il2cpp_monitor_try_wait"),
	il2cpp_runtime_invoke_convert_args: () => Il2Cpp.module.findExportByName("il2cpp_runtime_invoke_convert_args"),
	il2cpp_runtime_invoke: () => Il2Cpp.module.findExportByName("il2cpp_runtime_invoke"),
	il2cpp_runtime_class_init: () => Il2Cpp.module.findExportByName("il2cpp_runtime_class_init"),
	il2cpp_runtime_object_init: () => Il2Cpp.module.findExportByName("il2cpp_runtime_object_init"),
	il2cpp_runtime_object_init_exception: () => Il2Cpp.module.findExportByName("il2cpp_runtime_object_init_exception"),
	il2cpp_runtime_unhandled_exception_policy_set: () => Il2Cpp.module.findExportByName("il2cpp_runtime_unhandled_exception_policy_set"),
	il2cpp_string_length: () => Il2Cpp.module.findExportByName("il2cpp_string_length"),
	il2cpp_string_chars: () => Il2Cpp.module.findExportByName("il2cpp_string_chars"),
	il2cpp_string_new: () => Il2Cpp.module.findExportByName("il2cpp_string_new"),
	il2cpp_string_new_wrapper: () => Il2Cpp.module.findExportByName("il2cpp_string_new_wrapper"),
	il2cpp_string_new_utf16: () => Il2Cpp.module.findExportByName("il2cpp_string_new_utf16"),
	il2cpp_string_new_len: () => Il2Cpp.module.findExportByName("il2cpp_string_new_len"),
	il2cpp_string_intern: () => Il2Cpp.module.findExportByName("il2cpp_string_intern"),
	il2cpp_string_is_interned: () => Il2Cpp.module.findExportByName("il2cpp_string_is_interned"),
	il2cpp_thread_current: () => Il2Cpp.module.findExportByName("il2cpp_thread_current"),
	il2cpp_thread_attach: () => Il2Cpp.module.findExportByName("il2cpp_thread_attach"),
	il2cpp_thread_detach: () => Il2Cpp.module.findExportByName("il2cpp_thread_detach"),
	il2cpp_is_vm_thread: () => Il2Cpp.module.findExportByName("il2cpp_is_vm_thread"),
	il2cpp_current_thread_walk_frame_stack: () => Il2Cpp.module.findExportByName("il2cpp_current_thread_walk_frame_stack"),
	il2cpp_thread_walk_frame_stack: () => Il2Cpp.module.findExportByName("il2cpp_thread_walk_frame_stack"),
	il2cpp_current_thread_get_top_frame: () => Il2Cpp.module.findExportByName("il2cpp_current_thread_get_top_frame"),
	il2cpp_thread_get_top_frame: () => Il2Cpp.module.findExportByName("il2cpp_thread_get_top_frame"),
	il2cpp_current_thread_get_frame_at: () => Il2Cpp.module.findExportByName("il2cpp_current_thread_get_frame_at"),
	il2cpp_thread_get_frame_at: () => Il2Cpp.module.findExportByName("il2cpp_thread_get_frame_at"),
	il2cpp_current_thread_get_stack_depth: () => Il2Cpp.module.findExportByName("il2cpp_current_thread_get_stack_depth"),
	il2cpp_thread_get_stack_depth: () => Il2Cpp.module.findExportByName("il2cpp_thread_get_stack_depth"),
	il2cpp_set_default_thread_affinity: () => Il2Cpp.module.findExportByName("il2cpp_set_default_thread_affinity"),
	il2cpp_override_stack_backtrace: () => Il2Cpp.module.findExportByName("il2cpp_override_stack_backtrace"),
	il2cpp_type_get_object: () => Il2Cpp.module.findExportByName("il2cpp_type_get_object"),
	il2cpp_type_get_type: () => Il2Cpp.module.findExportByName("il2cpp_type_get_type"),
	il2cpp_type_get_class_or_element_class: () => Il2Cpp.module.findExportByName("il2cpp_type_get_class_or_element_class"),
	il2cpp_type_get_name: () => Il2Cpp.module.findExportByName("il2cpp_type_get_name"),
	il2cpp_type_get_assembly_qualified_name: () => Il2Cpp.module.findExportByName("il2cpp_type_get_assembly_qualified_name"),
	il2cpp_type_get_reflection_name: () => Il2Cpp.module.findExportByName("il2cpp_type_get_reflection_name"),
	il2cpp_type_is_byref: () => Il2Cpp.module.findExportByName("il2cpp_type_is_byref"),
	il2cpp_type_get_attrs: () => Il2Cpp.module.findExportByName("il2cpp_type_get_attrs"),
	il2cpp_type_equals: () => Il2Cpp.module.findExportByName("il2cpp_type_equals"),
	il2cpp_type_is_static: () => Il2Cpp.module.findExportByName("il2cpp_type_is_static"),
	il2cpp_type_is_pointer_type: () => Il2Cpp.module.findExportByName("il2cpp_type_is_pointer_type"),
	il2cpp_image_get_assembly: () => Il2Cpp.module.findExportByName("il2cpp_image_get_assembly"),
	il2cpp_image_get_name: () => Il2Cpp.module.findExportByName("il2cpp_image_get_name"),
	il2cpp_image_get_filename: () => Il2Cpp.module.findExportByName("il2cpp_image_get_filename"),
	il2cpp_image_get_entry_point: () => Il2Cpp.module.findExportByName("il2cpp_image_get_entry_point"),
	il2cpp_image_get_class_count: () => Il2Cpp.module.findExportByName("il2cpp_image_get_class_count"),
	il2cpp_image_get_class: () => Il2Cpp.module.findExportByName("il2cpp_image_get_class"),
	il2cpp_capture_memory_snapshot: () => Il2Cpp.module.findExportByName("il2cpp_capture_memory_snapshot"),
	il2cpp_free_captured_memory_snapshot: () => Il2Cpp.module.findExportByName("il2cpp_free_captured_memory_snapshot"),
	il2cpp_set_find_plugin_callback: () => Il2Cpp.module.findExportByName("il2cpp_set_find_plugin_callback"),
	il2cpp_register_log_callback: () => Il2Cpp.module.findExportByName("il2cpp_register_log_callback"),
	il2cpp_debugger_set_agent_options: () => Il2Cpp.module.findExportByName("il2cpp_debugger_set_agent_options"),
	il2cpp_is_debugger_attached: () => Il2Cpp.module.findExportByName("il2cpp_is_debugger_attached"),
	il2cpp_register_debugger_agent_transport: () => Il2Cpp.module.findExportByName("il2cpp_register_debugger_agent_transport"),
	il2cpp_debug_foreach_method: () => Il2Cpp.module.findExportByName("il2cpp_debug_foreach_method"),
	il2cpp_debug_get_method_info: () => Il2Cpp.module.findExportByName("il2cpp_debug_get_method_info"),
	il2cpp_unity_install_unitytls_interface: () => Il2Cpp.module.findExportByName("il2cpp_unity_install_unitytls_interface"),
	il2cpp_custom_attrs_from_class: () => Il2Cpp.module.findExportByName("il2cpp_custom_attrs_from_class"),
	il2cpp_custom_attrs_from_method: () => Il2Cpp.module.findExportByName("il2cpp_custom_attrs_from_method"),
	il2cpp_custom_attrs_from_field: () => Il2Cpp.module.findExportByName("il2cpp_custom_attrs_from_field"),
	il2cpp_custom_attrs_has_attr: () => Il2Cpp.module.findExportByName("il2cpp_custom_attrs_has_attr"),
	il2cpp_custom_attrs_get_attr: () => Il2Cpp.module.findExportByName("il2cpp_custom_attrs_get_attr"),
	il2cpp_custom_attrs_construct: () => Il2Cpp.module.findExportByName("il2cpp_custom_attrs_construct"),
	il2cpp_custom_attrs_free: () => Il2Cpp.module.findExportByName("il2cpp_custom_attrs_free"),
	il2cpp_type_get_name_chunked: () => Il2Cpp.module.findExportByName("il2cpp_type_get_name_chunked"),
	il2cpp_class_set_userdata: () => Il2Cpp.module.findExportByName("il2cpp_class_set_userdata"),
	il2cpp_class_get_userdata_offset: () => Il2Cpp.module.findExportByName("il2cpp_class_get_userdata_offset"),
	il2cpp_class_for_each: () => Il2Cpp.module.findExportByName("il2cpp_class_for_each"),
	il2cpp_unity_set_android_network_up_state_func: () => Il2Cpp.module.findExportByName("il2cpp_unity_set_android_network_up_state_func"),
};
let leftPrimary    = false;
let leftSecondary  = false;
let rightPrimary   = false;
let rightSecondary = false;
let leftGrab       = false;
let rightGrab      = false;
let leftTrigger    = false;
let rightTrigger   = false;
let deltaTime      = 0.0;
let time           = 0.0;
let frameCount     = 0;

class XRInputHandler {
  private InputDevices: any;
  private tryGetFeatureValue: any;
  private buttonStates: Map<string, boolean>;

  constructor() {
    this.InputDevices       = Il2Cpp.domain.assembly("UnityEngine.XRModule").image.class("UnityEngine.XR.InputDevices");
    this.tryGetFeatureValue = this.InputDevices.method("TryGetFeatureValue_bool", 3);
    this.buttonStates       = new Map();
  }

  update() {
    for (const id of [1, 2]) {
      for (const feat of ["PrimaryButton","SecondaryButton","GripButton","TriggerButton","MenuButton"]) {
        this.buttonStates.set(`${id}_${feat}`, this.getButtonState(id, feat));
      }
    }
  }

  private getButtonState(deviceId: number, feature: string): boolean {
    try {
      const ptr     = Il2Cpp.alloc(1);
      const success = this.tryGetFeatureValue.invoke(uint64(deviceId), Il2Cpp.string(feature), ptr);
      if (success) return ptr.readU8() !== 0;
    } catch(_) {}
    return false;
  }

  isPressed(id: number, feat: string): boolean { return this.buttonStates.get(`${id}_${feat}`) || false; }
  get leftPrimary():    boolean { return this.isPressed(1, "PrimaryButton");   }
  get leftSecondary():  boolean { return this.isPressed(1, "SecondaryButton"); }
  get rightPrimary():   boolean { return this.isPressed(2, "PrimaryButton");   }
  get rightSecondary(): boolean { return this.isPressed(2, "SecondaryButton"); }
  get leftGrab():       boolean { return this.isPressed(1, "GripButton");      }
  get rightGrab():      boolean { return this.isPressed(2, "GripButton");      }
  get leftTrigger():    boolean { return this.isPressed(1, "TriggerButton");   }
  get rightTrigger():   boolean { return this.isPressed(2, "TriggerButton");   }
}

Il2Cpp.perform(() => {
  const SGAirlock        = Il2Cpp.domain.assembly("SG.Airlock").image;
  const UnityEngineCore  = Il2Cpp.domain.assembly("UnityEngine.CoreModule").image;
  const UnityEnginePhys  = Il2Cpp.domain.assembly("UnityEngine.PhysicsModule").image;
  const TextMeshProImage = Il2Cpp.domain.assembly("Unity.TextMeshPro").image;

  const LocomotionPlayerClass = SGAirlock.class("SG.Airlock.Network.NetworkedLocomotionPlayer");
  const PlayerStateClass      = SGAirlock.class("SG.Airlock.PlayerState");
  const MinigamePlayerClass   = SGAirlock.class("SG.Airlock.MinigamePlayer");

  const GameObject  = UnityEngineCore.class("UnityEngine.GameObject");
  const Object      = UnityEngineCore.class("UnityEngine.Object");
  const Time        = UnityEngineCore.class("UnityEngine.Time");
  const Application = UnityEngineCore.class("UnityEngine.Application");
  const TextMeshPro = TextMeshProImage.class("TMPro.TextMeshPro");

  function getTransform(obj: any)           { return obj.method("get_transform").invoke(); }
  function getComponent(obj: any, t: any)   { return obj.method("GetComponent", 1).inflate(t).invoke(); }

  let localPlayer: any       = null;
  let localPlayerState: any  = null;
  let leftHandTransform: any  = null;
  let rightHandTransform: any = null;

  function refreshLocalPlayer() {
    try {
      const players = Object.method("FindObjectsOfType", 0).inflate(LocomotionPlayerClass).invoke();
      for (let i = 0; i < players.length; i++) {
        const p = players.get(i);
        try {
          if (p.method("get_HasInputAuthority").invoke()) {
            localPlayer = p;
            try { localPlayerState  = p.method("get_LocalPlayerState").invoke();  } catch(_) {}
            try { leftHandTransform  = p.method("get_leftHandTransform").invoke();  } catch(_) {}
            try { rightHandTransform = p.method("get_rightHandTransform").invoke(); } catch(_) {}
            console.log("[amogus] local player found");
            return;
          }
        } catch(_) {}
      }
    } catch(_) {}
  }

  refreshLocalPlayer();
  function allPlayers() {
    try { return Object.method("FindObjectsOfType", 0).inflate(LocomotionPlayerClass).invoke(); } catch(_) { return null; }
  }
  function allPlayerStates() {
    try { return Object.method("FindObjectsOfType", 0).inflate(PlayerStateClass).invoke(); } catch(_) { return null; }
  }

  // GameRole enum: NotSet=0, Crewmember=1, Impostor=2, Engineer=3, Infected=4,
  //                Vigilante=5, Sheriff=6, VIP=7, GuardianAngel=8, Revenger=9, Tracker=10
  const roleNames = ["NotSet","Crewmate","Impostor","Engineer","Infected","Vigilante","Sheriff","VIP","Guardian","Revenger","Tracker"];

  let speedVal = 3.0;

  function speedUp() {
    speedVal += 2.0;
    if (localPlayer) try { localPlayer.method("SetPlayerWalkSpeed", 2).invoke(speedVal, false); } catch(_) {}
  }
  function speedDown() {
    speedVal = Math.max(1.0, speedVal - 2.0);
    if (localPlayer) try { localPlayer.method("SetPlayerWalkSpeed", 2).invoke(speedVal, false); } catch(_) {}
  }
  function godMode() {
    if (!localPlayerState) return;
    try { localPlayerState.method("set_IsAlive").invoke(true); } catch(_) {}
  }
  function noKillCooldown() {
    if (!localPlayerState) return;
    try { localPlayerState.field("_ActionCooldownRemaining").value = 0; } catch(_) {}
  }
  function alwaysImpostor() {
    if (!localPlayerState) return;
    try { localPlayerState.method("set_ForceImposter", 1).invoke(true); } catch(_) {}
    try { localPlayerState.method("RPC_ForceImposter", 1).invoke(true); } catch(_) {}
    try { localPlayerState.method("set_UniversalGameRole", 1).invoke(2); } catch(_) {}
    try { localPlayerState.method("RPC_ForceRole", 1).invoke(2); } catch(_) {}
  }
  function forceImpostor() {
    if (!localPlayerState) return;
    try { localPlayerState.method("set_ForceImposter", 1).invoke(true); } catch(_) {}
    try { localPlayerState.method("RPC_ForceImposter", 1).invoke(true); } catch(_) {}
  }
  function setRole(role: number) {
    if (!localPlayerState) return;
    try { localPlayerState.method("set_UniversalGameRole", 1).invoke(role); } catch(_) {}
    try { localPlayerState.method("RPC_ForceRole", 1).invoke(role); } catch(_) {}
  }
  function killAll() {
    const ps = allPlayerStates();
    if (!ps) return;
    for (let i = 0; i < ps.length; i++) {
      try {
        const p  = ps.get(i);
        const lp = p.field("LocomotionPlayer").value;
        if (lp && !lp.isNull() && lp.method("get_HasInputAuthority").invoke()) continue;
        p.method("KillPlayer", 5).invoke(true, false, true, null, false);
      } catch(_) {}
    }
  }
  function fakeKillAll() {
    const ps = allPlayerStates();
    if (!ps) return;
    for (let i = 0; i < ps.length; i++) {
      try {
        const p  = ps.get(i);
        const lp = p.field("LocomotionPlayer").value;
        if (lp && !lp.isNull() && lp.method("get_HasInputAuthority").invoke()) continue;
        p.method("FakeKill", 2).invoke(1, false);
      } catch(_) {}
    }
  }
  function infectAll() {
    const pl = allPlayers();
    if (!pl) return;
    for (let i = 0; i < pl.length; i++) {
      try { pl.get(i).method("PlayInfectSFX").invoke(); } catch(_) {}
      try { pl.get(i).method("PlayInfectFX").invoke();  } catch(_) {}
    }
  }
  function completeTasks() {
    if (!localPlayer) return;
    for (const fieldName of ["LocalMinigamePlayer", "TaskPlayer"]) {
      try {
        const mp = localPlayer.field(fieldName).value;
        if (mp && !mp.isNull()) mp.method("ForceCompleteTask", 1).invoke(0);
      } catch(_) {}
    }
    try {
      const mps = Object.method("FindObjectsOfType", 0).inflate(MinigamePlayerClass).invoke();
      for (let i = 0; i < mps.length; i++) {
        try { mps.get(i).method("ForceCompleteTask", 1).invoke(0); } catch(_) {}
      }
    } catch(_) {}
  }
  function revealRoles() {
    const ps = allPlayerStates();
    if (!ps) { console.log("[reveal] no PlayerState objects"); return; }
    console.log("[reveal] === ROLE DUMP ===");
    for (let i = 0; i < ps.length; i++) {
      try {
        const p     = ps.get(i);
        const name  = p.field("DisplayName").value?.toString() ?? "???";
        const role  = p.method("get_UniversalGameRole").invoke();
        const alive = p.method("get_IsAlive").invoke();
        console.log("[reveal] " + name + " | " + (roleNames[role] ?? role) + " | alive=" + alive);
      } catch(_) {}
    }
  }
  function freezeAll() {
    const pl = allPlayers();
    if (!pl) return;
    for (let i = 0; i < pl.length; i++) {
      try {
        const p = pl.get(i);
        if (!p.method("get_HasInputAuthority").invoke())
          p.field("IgnoreNetworkInput").value = true;
      } catch(_) {}
    }
  }
  function unfreezeAll() {
    const pl = allPlayers();
    if (!pl) return;
    for (let i = 0; i < pl.length; i++) {
      try { pl.get(i).field("IgnoreNetworkInput").value = false; } catch(_) {}
    }
  }
  function disconnect() {
    try {
      const FusionImage = Il2Cpp.domain.assembly("Fusion.Runtime").image;
      const runners = Object.method("FindObjectsOfType", 0)
        .inflate(FusionImage.class("Fusion.NetworkRunner")).invoke();
      if (runners && runners.length > 0) runners.get(0).method("Shutdown", 0).invoke();
    } catch(e) { console.log("[disconnect] " + e); }
  }

  // ── Categories ───────────────────────────────────────────────────────────────
  const categories = ["PLAYER", "IMPOSTOR", "TASKS", "ROLES", "MISC", "CREDITS"];

  const catColors: Record<string, string> = {
    "PLAYER":   "#00FF88",
    "IMPOSTOR": "#FF4444",
    "TASKS":    "#FFD700",
    "ROLES":    "#A78BFA",
    "MISC":     "#60A5FA",
    "CREDITS":  "#f332d2",
  };

  // ── Mod list ─────────────────────────────────────────────────────────────────
  interface ModEntry {
    name: string;
    desc: string;
    active: boolean;
    toggleable: boolean;
    method: (() => void) | null;
    category: string;
  }

  const mods: ModEntry[] = [
    // PLAYER
    { name: "Speed++",      desc: "Increase walk speed (+2)",       active: false, toggleable: false, method: speedUp,   category: "PLAYER" },
    { name: "Speed--",      desc: "Decrease walk speed (-2)",       active: false, toggleable: false, method: speedDown, category: "PLAYER" },
    { name: "God Mode",     desc: "set_IsAlive every frame",        active: false, toggleable: true,  method: null,      category: "PLAYER" },
    { name: "No Kill CD",   desc: "Zero kill cooldown every frame", active: false, toggleable: true,  method: null,      category: "PLAYER" },
    { name: "Freeze All",   desc: "IgnoreNetworkInput on others",   active: false, toggleable: false, method: freezeAll, category: "PLAYER" },
    { name: "Unfreeze All", desc: "Re-enable input for all",        active: false, toggleable: false, method: unfreezeAll, category: "PLAYER" },

    // IMPOSTOR
    { name: "Always Impostor", desc: "eyecantsee dih is always hard, as hard as how this mod be going",          active: false, toggleable: true, method: alwaysImpostor,      category: "IMPOSTOR" },
    { name: "Force Impostor", desc: "set_ForceImposter + RPC",          active: false, toggleable: false, method: forceImpostor,      category: "IMPOSTOR" },
    { name: "Kill All",       desc: "KillPlayer on every other player",  active: false, toggleable: false, method: killAll,            category: "IMPOSTOR" },
    { name: "Fake Kill All",  desc: "FakeKill on every other player",    active: false, toggleable: false, method: fakeKillAll,        category: "IMPOSTOR" },
    { name: "Infect All",     desc: "PlayInfectSFX + FX on everyone",   active: false, toggleable: false, method: infectAll,          category: "IMPOSTOR" },
    { name: "Spam Infect",    desc: "Infect all every fixed frame",      active: false, toggleable: true,  method: null,               category: "IMPOSTOR" },
    { name: "Be Crewmate",   desc: "RPC_ForceRole → Crewmember (1)",    active: false, toggleable: false, method: () => setRole(1),   category: "IMPOSTOR" },
    { name: "Be Impostor",   desc: "RPC_ForceRole → Impostor (2)",      active: false, toggleable: false, method: () => setRole(2),   category: "IMPOSTOR" },
    { name: "Be Engineer",   desc: "RPC_ForceRole → Engineer (3)",      active: false, toggleable: false, method: () => setRole(3),   category: "IMPOSTOR" },
    { name: "Be Sheriff",    desc: "RPC_ForceRole → Sheriff (6)",       active: false, toggleable: false, method: () => setRole(6),   category: "IMPOSTOR" },
    { name: "Be Guardian",   desc: "RPC_ForceRole → GuardianAngel (8)", active: false, toggleable: false, method: () => setRole(8),   category: "IMPOSTOR" },

    // TASKS
    { name: "Complete Tasks", desc: "ForceCompleteTask(0) on all MinigamePlayers", active: false, toggleable: false, method: completeTasks, category: "TASKS" },

    // ROLES
    { name: "Reveal Roles", desc: "Dump names + roles to logcat",    active: false, toggleable: false, method: revealRoles, category: "ROLES" },
    { name: "Dump Runtime", desc: "IL2CPP runtime dump to /sdcard",  active: false, toggleable: false, method: () => { try { Il2Cpp.dump(); } catch(_) {} }, category: "ROLES" },

    // MISC
    { name: "Disconnect",  desc: "Disconnects you from the current room.",  active: false, toggleable: false, method: disconnect, category: "MISC" },
    { name: "Anti-Kick",   desc: "Forcefully cancels the quit method.",        active: false, toggleable: true,  method: null,       category: "MISC" },
  
    // CREDITS
    { name: "Anti-Kick",   desc: "Forcefully cancels the quit method.",        active: false, toggleable: true,  method: null,       category: "CREDITS" },
  ];

  function getMod(name: string): ModEntry | undefined { return mods.find(m => m.name === name); }
  function getModsInCat(cat: string): ModEntry[]      { return mods.filter(m => m.category === cat); }

  let catIndex      = 0;
  let menuMode      = "cats"; // "cats" | "mods"
  let modIndexInCat = 0;
  let cdNext   = false;
  let cdPrev   = false;
  let cdSelect = false;
  let cdBack   = false;

  function buildMenuText(): string {
    const cat = categories[catIndex];
    const col = catColors[cat] || "#FFFFFF";

    if (menuMode === "cats") {
      const modsInCat   = getModsInCat(cat);
      const activeCount = modsInCat.filter(m => m.active).length;
      const preview     = modsInCat.slice(0, 3).map(m =>
        m.active
          ? `<color=green>${m.name}</color>`
          : `<color=#555555>${m.name}</color>`
      ).join("  ");
      return (
        "<color=red> LARP </color>\n" +
        `<color=${col}>  ${cat}  </color>\n` +
        `<size=7>${preview}</size>\n` +
        `<color=#666666>${modsInCat.length} mods  ·  <color=green>${activeCount} ON</color></color>\n` +
        "<size=6>RT/LT = browse   RP = open</size>"
      );
    } else {
      const modsInCat = getModsInCat(cat);
      const curr      = modsInCat[modIndexInCat];
      const statusTag = curr.toggleable
        ? (curr.active
          ? " [<color=green>ON</color>]"
          : " [<color=red>OFF</color>]")
        : "";
      const idx   = modIndexInCat + 1;
      const total = modsInCat.length;
      let dots = "";
      for (let i = 0; i < total; i++) {
        dots += (i === modIndexInCat)
          ? `<color=${col}>-></color>`
          : "<color=#333333>-></color>";
      }
      return (
        `<color=${col}>${cat}</color>  <color=#444444>${idx}/${total}</color>\n` +
        `<b>${curr.name}</b>${statusTag}\n` +
        `<color=#279FF5><size=7>${curr.desc}</size></color>\n` +
        `<size=6>${dots}</size>\n` +
        "<size=6>RT/LT=scroll  RP=select  LP=back</size>"
      );
    }
  }

  let statusCanvas: any = null;
  let statusText: any   = null;

  function createHandUI(): any {
    try {
      if (!leftHandTransform) return null;
      const anyTMP = Object.method("FindObjectOfType", 0).inflate(TextMeshPro).invoke();
      if (!anyTMP || anyTMP.isNull()) {
        console.log("[ui] no TMP in scene to clone");
        return null;
      }
      const menuGO = Object.method("Instantiate", 1).invoke(anyTMP.method("get_gameObject").invoke());
      statusText = getComponent(menuGO, TextMeshPro);
      const tf   = getTransform(menuGO);
      tf.method("SetParent",         1).invoke(leftHandTransform);
      tf.method("set_localPosition").invoke([0, 0.15, 0]);
      tf.method("set_localEulerAngles").invoke([0, 0, 0]);
      tf.method("set_localScale").invoke([0.035, 0.035, 0.035]);
      statusText.method("set_fontSize").invoke(8);
      statusText.method("set_color").invoke([1, 1, 1, 1]);
      console.log("[ui] hand UI created");
      return menuGO;
    } catch(e) { console.log("[ui] createHandUI failed: " + e); return null; }
  }

  const OVRInputHandler = new XRInputHandler();
  const SightboxClass = SGAirlock.class("SG.Airlock.Blindbox.SightboxVolumeHandler");
  const UpdateHook    = SightboxClass.method("FixedUpdate");

  UpdateHook.implementation = function() {
    if (!localPlayer || !leftHandTransform) refreshLocalPlayer();

    OVRInputHandler.update();
    leftPrimary    = OVRInputHandler.leftPrimary;
    leftSecondary  = OVRInputHandler.leftSecondary;
    rightPrimary   = OVRInputHandler.rightPrimary;
    rightSecondary = OVRInputHandler.rightSecondary;
    leftGrab       = OVRInputHandler.leftGrab;
    rightGrab      = OVRInputHandler.rightGrab;
    leftTrigger    = OVRInputHandler.leftTrigger;
    rightTrigger   = OVRInputHandler.rightTrigger;

    deltaTime = Time.method("get_deltaTime").invoke();
    time      = Time.method("get_time").invoke();
    frameCount++;

    if (leftSecondary) {
      if (menuMode === "cats") {
        if (rightTrigger && !cdNext)  { catIndex = (catIndex + 1) % categories.length; cdNext = true; }
        if (!rightTrigger) cdNext = false;
        if (leftTrigger && !cdPrev)   { catIndex = (catIndex - 1 + categories.length) % categories.length; cdPrev = true; }
        if (!leftTrigger) cdPrev = false;
        if (rightPrimary && !cdSelect) { menuMode = "mods"; modIndexInCat = 0; cdSelect = true; }
        if (!rightPrimary) cdSelect = false;
      } else {
        const modsInCat = getModsInCat(categories[catIndex]);
        if (rightTrigger && !cdNext)  { modIndexInCat = (modIndexInCat + 1) % modsInCat.length; cdNext = true; }
        if (!rightTrigger) cdNext = false;
        if (leftTrigger && !cdPrev)   { modIndexInCat = (modIndexInCat - 1 + modsInCat.length) % modsInCat.length; cdPrev = true; }
        if (!leftTrigger) cdPrev = false;
        if (rightPrimary && !cdSelect) {
          const curr = modsInCat[modIndexInCat];
          if (curr.toggleable) {
            curr.active = !curr.active;
          } else {
            try { if (curr.method) curr.method(); } catch(e) { console.log("[mod] " + curr.name + ": " + e); }
          }
          cdSelect = true;
        }
        if (!rightPrimary) cdSelect = false;
        if (leftPrimary && !cdBack) { menuMode = "cats"; cdBack = true; }
        if (!leftPrimary) cdBack = false;
      }
    } else {
      cdNext = false; cdPrev = false; cdSelect = false; cdBack = false;
    }

    for (const mod of mods) {
      if (mod.toggleable && mod.active) {
        try {
          const n = mod.name;
          if      (n === "God Mode")    godMode();
          else if (n === "No Kill CD")  noKillCooldown();
          else if (n === "Spam Infect") infectAll();
          else if (n === "Anti-Kick")   { try { Application.method("CancelQuit").invoke(); } catch(_) {} }
        } catch(_) {}
      }
    }

    if (!statusCanvas && leftHandTransform) statusCanvas = createHandUI();
    if (statusCanvas) {
      statusCanvas.method("SetActive").invoke(leftSecondary);
      if (leftSecondary && statusText) {
        try { statusText.method("set_text").invoke(Il2Cpp.string(buildMenuText())); } catch(_) {}
      }
    }

    return this.method("FixedUpdate").invoke();
  };

  console.log("[amogus] loaded " + new Date().toISOString());

}, "main");
