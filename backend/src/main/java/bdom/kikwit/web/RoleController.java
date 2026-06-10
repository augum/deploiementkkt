package bdom.kikwit.web;

import bdom.kikwit.Dto.RoleRequestDto;
import bdom.kikwit.Dto.RoleResponseDto;
import bdom.kikwit.Services.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "Role", description = "Gestion des roles")

public class RoleController {
    private RoleService service;

    @PostMapping(path = "/roles")
    @Operation(summary = "Insertion des roles")
    public RoleResponseDto save(@RequestBody RoleRequestDto requestDto){
       return service.save(requestDto);
    }
    @GetMapping(path = "/roles/{id}")
    @Operation(summary = "Afficher un role à partir de son id")
    public RoleResponseDto getOne(@PathVariable Long id){
        return  service.getOne(id);
    }
    @GetMapping(path = "/roles")
    @Operation(summary = "listes des roles")
    public List<RoleResponseDto> lis(){
        return  service.list();
    }
    @PatchMapping(path = "/roles/{id}")
    @Operation(summary = "Modifications des roles")
    public RoleResponseDto update(@PathVariable Long id, @RequestBody RoleRequestDto requestDto){
        return  service.update(id,requestDto);
    }
    @DeleteMapping(path = "/roles/{id}")
    @Operation(summary = "Supprimer des roles")
    public String delete(@PathVariable Long id){
        return  service.delete(id);
    }
}
